-- ESCALIA Studio · Mini-CRM & Dashboard de Ingresos
-- Ejecuta este script UNA VEZ en Supabase Dashboard > SQL Editor > New query > Run.
-- Proyecto: productosaas2026@gmail.com's Project (joobdkwgtuavbomstthg)

create extension if not exists pgcrypto;

-- =========================================================
-- 1. TABLA: leads (mini-CRM de clientes potenciales)
-- =========================================================
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text,
  country text,
  channel text,
  product varchar(200),
  amount numeric(12, 2) check (amount is null or amount >= 0),
  currency text not null default 'USD' check (currency in ('USD', 'PEN')),
  source text not null default 'manual' check (source in ('web_form', 'calendly', 'manual', 'whatsapp_interes')),
  status text not null default 'nuevo' check (status in ('nuevo', 'contactado', 'en_negociacion', 'ganado', 'perdido')),
  notes text,
  created_at timestamptz not null default now()
);

comment on table public.leads is 'Mini-CRM: leads/clientes potenciales capturados desde la web, Calendly o registro manual de administradores.';

-- Migración idempotente: agrega columnas nuevas si la tabla ya existía antes de este cambio.
alter table public.leads add column if not exists amount numeric(12, 2);
alter table public.leads add column if not exists currency text not null default 'USD';
alter table public.leads alter column product type varchar(200);
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'leads_amount_check'
  ) then
    alter table public.leads add constraint leads_amount_check check (amount is null or amount >= 0);
  end if;
  if not exists (
    select 1 from pg_constraint where conname = 'leads_currency_check'
  ) then
    alter table public.leads add constraint leads_currency_check check (currency in ('USD', 'PEN'));
  end if;
end $$;

comment on column public.leads.amount is 'Monto del producto/negocio asociado al lead. Si status = ganado, se suma a las Ganancias Totales junto con la tabla revenue.';
comment on column public.leads.product is 'Nombre del producto de interés (máx. 200 caracteres).';

-- =========================================================
-- 2. TABLA: revenue (ganancias por canal / producto)
-- =========================================================
create table if not exists public.revenue (
  id uuid primary key default gen_random_uuid(),
  channel text not null,
  product text not null,
  amount numeric(12, 2) not null check (amount >= 0),
  currency text not null default 'USD' check (currency in ('USD', 'PEN')),
  description text,
  entry_date date not null default current_date,
  created_at timestamptz not null default now()
);

comment on table public.revenue is 'Ingresos/ganancias por canal y producto, cargados manualmente por los administradores.';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'revenue_currency_check'
  ) then
    alter table public.revenue add constraint revenue_currency_check check (currency in ('USD', 'PEN'));
  end if;
end $$;

-- =========================================================
-- 2b. TABLA: app_settings (tipo de cambio USD/PEN, fila única)
-- =========================================================
create table if not exists public.app_settings (
  id boolean primary key default true,
  usd_to_pen numeric(10, 4) not null default 3.75,
  updated_at timestamptz not null default now(),
  constraint app_settings_singleton check (id)
);

comment on table public.app_settings is 'Configuración global (fila única). usd_to_pen: cuántos Soles equivalen a 1 Dólar, usado para consolidar Ganancias Totales cuando hay montos en ambas monedas.';

insert into public.app_settings (id) values (true) on conflict (id) do nothing;

-- =========================================================
-- 3. ROW LEVEL SECURITY
-- =========================================================
alter table public.leads enable row level security;
alter table public.revenue enable row level security;
alter table public.app_settings enable row level security;

-- Helper: ¿el usuario autenticado es uno de los 2 administradores autorizados?
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(auth.email(), '') in ('productosaas2026@gmail.com', 'lmzd89492@gmail.com');
$$;

-- --- leads ---
-- Cualquier visitante del sitio (anónimo) puede CREAR un lead (formularios públicos),
-- pero solo los administradores pueden leer, editar o borrar.
--
-- NOTA para quien mantenga esto: un INSERT con RETURNING (p.ej. .insert(...).select()
-- en supabase-js) exige ADEMÁS pasar la política de SELECT sobre la fila insertada
-- (comportamiento estándar de RLS en Postgres). Como el SELECT de "leads" está
-- restringido a admins, cualquier insert público debe hacerse SIN encadenar
-- .select() — así lo hace WorkWithUsModal.tsx. Si se agrega .select() a un insert
-- público, volverá a fallar con "new row violates row-level security policy"
-- aunque el INSERT en sí sea válido.
drop policy if exists "public can insert leads" on public.leads;
create policy "public can insert leads"
  on public.leads for insert
  to anon, authenticated
  with check (true);

drop policy if exists "admins can read leads" on public.leads;
create policy "admins can read leads"
  on public.leads for select
  to authenticated
  using (public.is_admin());

drop policy if exists "admins can update leads" on public.leads;
create policy "admins can update leads"
  on public.leads for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admins can delete leads" on public.leads;
create policy "admins can delete leads"
  on public.leads for delete
  to authenticated
  using (public.is_admin());

-- --- revenue ---
-- Solo los administradores pueden leer y escribir ingresos (dato sensible).
drop policy if exists "admins can read revenue" on public.revenue;
create policy "admins can read revenue"
  on public.revenue for select
  to authenticated
  using (public.is_admin());

drop policy if exists "admins can insert revenue" on public.revenue;
create policy "admins can insert revenue"
  on public.revenue for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "admins can update revenue" on public.revenue;
create policy "admins can update revenue"
  on public.revenue for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admins can delete revenue" on public.revenue;
create policy "admins can delete revenue"
  on public.revenue for delete
  to authenticated
  using (public.is_admin());

-- --- app_settings ---
-- Solo administradores pueden ver y actualizar el tipo de cambio.
drop policy if exists "admins can read settings" on public.app_settings;
create policy "admins can read settings"
  on public.app_settings for select
  to authenticated
  using (public.is_admin());

drop policy if exists "admins can update settings" on public.app_settings;
create policy "admins can update settings"
  on public.app_settings for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- =========================================================
-- 4. ÍNDICES
-- =========================================================
create index if not exists leads_channel_idx on public.leads (channel);
create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists revenue_channel_idx on public.revenue (channel);
create index if not exists revenue_entry_date_idx on public.revenue (entry_date desc);

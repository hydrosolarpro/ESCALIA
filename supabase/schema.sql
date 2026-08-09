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
  product text,
  source text not null default 'manual' check (source in ('web_form', 'calendly', 'manual', 'whatsapp_interes')),
  status text not null default 'nuevo' check (status in ('nuevo', 'contactado', 'en_negociacion', 'ganado', 'perdido')),
  notes text,
  created_at timestamptz not null default now()
);

comment on table public.leads is 'Mini-CRM: leads/clientes potenciales capturados desde la web, Calendly o registro manual de administradores.';

-- =========================================================
-- 2. TABLA: revenue (ganancias por canal / producto)
-- =========================================================
create table if not exists public.revenue (
  id uuid primary key default gen_random_uuid(),
  channel text not null,
  product text not null,
  amount numeric(12, 2) not null check (amount >= 0),
  currency text not null default 'USD',
  description text,
  entry_date date not null default current_date,
  created_at timestamptz not null default now()
);

comment on table public.revenue is 'Ingresos/ganancias por canal y producto, cargados manualmente por los administradores.';

-- =========================================================
-- 3. ROW LEVEL SECURITY
-- =========================================================
alter table public.leads enable row level security;
alter table public.revenue enable row level security;

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

-- =========================================================
-- 4. ÍNDICES
-- =========================================================
create index if not exists leads_channel_idx on public.leads (channel);
create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists revenue_channel_idx on public.revenue (channel);
create index if not exists revenue_entry_date_idx on public.revenue (entry_date desc);

import { createClient } from '@supabase/supabase-js';

// Vercel Cron (ver vercel.json > crons) llama esta ruta 1 vez al día.
// Hace un SELECT 1 mínimo contra Supabase (función public.keepalive_ping,
// ver supabase/schema.sql) para que el proyecto nunca se marque como
// inactivo y Supabase lo pause automáticamente.
export default async function handler(req: any, res: any) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    res.status(500).json({ ok: false, error: 'Faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY en las variables de entorno de Vercel.' });
    return;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await supabase.rpc('keepalive_ping');

    if (error) {
      res.status(500).json({ ok: false, error: error.message });
      return;
    }

    res.status(200).json({ ok: true, result: data, timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ ok: false, error: err instanceof Error ? err.message : 'Error desconocido' });
  }
}

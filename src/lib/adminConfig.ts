/**
 * Allowlist de administradores. Es solo la capa de UX (ocultar/mostrar el dashboard);
 * la seguridad real vive en las políticas RLS de Supabase, que restringen las
 * tablas `leads` y `revenue` a estos mismos correos vía auth.email().
 */
export const ADMIN_EMAILS = ['productosaas2026@gmail.com', 'lmzd89492@gmail.com'];

export const isAdminEmail = (email: string | null | undefined): boolean =>
  !!email && ADMIN_EMAILS.includes(email.toLowerCase());

import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { EscaliaLogo } from '../../components/EscaliaLogo';

export const Login: React.FC = () => {
  const { session, isAdmin, signIn } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (session && isAdmin) {
    const redirectTo = (location.state as { from?: string })?.from || '/admin';
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: signInError } = await signIn(email, password);
    setSubmitting(false);

    if (signInError) {
      setError('Credenciales inválidas. Verifica tu correo y contraseña.');
      return;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-4">
          <EscaliaLogo variant="dark" />
          <div className="text-center space-y-1">
            <h1 className="font-display text-2xl font-black text-white">Panel Administrativo</h1>
            <p className="font-body text-sm text-[#cbd5e1]">Acceso exclusivo para administradores de ESCALIA Studio</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#121214] border border-[#27272a] rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl"
        >
          {session && !isAdmin && (
            <div className="bg-[#D32F2F]/10 border border-[#D32F2F]/40 text-[#FF3D3D] text-xs font-mono-custom rounded-lg p-3">
              Esta cuenta no tiene permisos de administrador.
            </div>
          )}

          {error && (
            <div className="bg-[#D32F2F]/10 border border-[#D32F2F]/40 text-[#FF3D3D] text-xs font-mono-custom rounded-lg p-3">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="font-mono-custom text-xs text-[#cbd5e1] uppercase tracking-wider" htmlFor="email">
              Correo
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@escalia.studio"
              className="w-full bg-[#09090b] border border-[#27272a] focus:border-[#D32F2F] outline-none rounded-lg px-4 py-3 text-sm text-white placeholder:text-[#525252] transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="font-mono-custom text-xs text-[#cbd5e1] uppercase tracking-wider" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#09090b] border border-[#27272a] focus:border-[#D32F2F] outline-none rounded-lg px-4 py-3 text-sm text-white placeholder:text-[#525252] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full fire-gradient text-white font-mono-custom text-xs font-bold uppercase tracking-wider rounded-lg py-3.5 hover:brightness-110 transition-all shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Ingresando…' : 'Iniciar Sesión'}
          </button>
        </form>

        <a href="/" className="block text-center font-mono-custom text-xs text-[#525252] hover:text-[#cbd5e1] transition-colors">
          ← Volver al sitio
        </a>
      </div>
    </div>
  );
};

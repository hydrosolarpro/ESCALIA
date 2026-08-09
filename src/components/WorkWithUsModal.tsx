import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface WorkWithUsModalProps {
  open: boolean;
  onClose: () => void;
  onShowToast: (message: string) => void;
}

interface FormState {
  full_name: string;
  email: string;
  phone: string;
  country: string;
  domain: string;
}

const emptyForm: FormState = { full_name: '', email: '', phone: '', country: '', domain: '' };

export const WorkWithUsModal: React.FC<WorkWithUsModalProps> = ({ open, onClose, onShowToast }) => {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Abrimos WhatsApp de forma síncrona dentro del gesto del usuario (click) para
    // que el navegador no lo bloquee como pop-up; el insert a Supabase corre en paralelo.
    const waMessage = `Hola! Soy ${form.full_name}, experto en ${form.domain || 'un dominio de negocio'} y me interesa trabajar con ESCALIA Studio.`;
    window.open(`https://wa.me/51960442025?text=${encodeURIComponent(waMessage)}`, '_blank', 'noopener,noreferrer');

    supabase
      .from('leads')
      .insert({
        full_name: form.full_name,
        email: form.email || null,
        phone: form.phone || null,
        country: form.country || null,
        channel: null,
        product: form.domain || null,
        source: 'whatsapp_interes',
        status: 'nuevo',
        notes: `Interesado en trabajar con ESCALIA como experto en: ${form.domain || 'No especificado'}`,
      })
      .then(({ error }) => {
        if (error) console.error('No se pudo registrar el lead:', error.message);
      });

    setSubmitting(false);
    onShowToast('¡Gracias! Te redirigimos a WhatsApp para continuar la conversación.');
    setForm(emptyForm);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-md flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[#131313] border border-[#2A2A2A] rounded-2xl p-6 md:p-8 max-w-lg w-full space-y-5 relative shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-[#e4beba] hover:text-white p-1"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Welcome Message */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00E676]/10 border border-[#00E676]/30">
            <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse"></span>
            <span className="font-mono-custom text-[11px] font-bold text-[#00E676] tracking-wider uppercase">
              Red de Expertos ESCALIA
            </span>
          </div>
          <h3 className="font-display text-2xl font-black text-white leading-tight">
            ¡Nos alegra tu interés en trabajar con nosotros!
          </h3>
          <p className="font-body text-sm text-[#cbd5e1] leading-relaxed">
            Cuéntanos brevemente quién eres y en qué dominio tienes experticia. Con estos datos te
            contactaremos directamente por WhatsApp para conocer cómo podemos colaborar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            required
            placeholder="Nombre completo"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            className="sm:col-span-2 bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-[#525252] outline-none focus:border-[#D32F2F]"
          />
          <input
            type="email"
            required
            placeholder="Correo electrónico"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-[#525252] outline-none focus:border-[#D32F2F]"
          />
          <input
            required
            placeholder="Teléfono"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-[#525252] outline-none focus:border-[#D32F2F]"
          />
          <input
            required
            placeholder="País"
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
            className="bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-[#525252] outline-none focus:border-[#D32F2F]"
          />
          <input
            required
            placeholder="Dominio de experticia (ej. UX/UI, IA, Marketing)"
            value={form.domain}
            onChange={(e) => setForm({ ...form, domain: e.target.value })}
            className="bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-[#525252] outline-none focus:border-[#D32F2F]"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 fire-gradient text-white font-mono-custom text-xs font-bold uppercase tracking-wider rounded-xl hover:brightness-110 transition-all shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-base">forum</span>
          {submitting ? 'Enviando…' : 'Continuar a WhatsApp'}
        </button>
      </form>
    </div>
  );
};

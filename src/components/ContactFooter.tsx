import React, { useState } from 'react';
import { DiscoveryFormState } from '../types';
import { EscaliaLogo } from './EscaliaLogo';
import { WorkWithUsModal } from './WorkWithUsModal';

interface ContactFooterProps {
  onOpenAppointment: () => void;
  onShowToast: (message: string) => void;
}

export const ContactFooter: React.FC<ContactFooterProps> = ({ onOpenAppointment, onShowToast }) => {
  const [formData, setFormData] = useState<DiscoveryFormState>({
    name: '',
    email: '',
    reason: 'Desarrollo SaaS a Medida',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeLegalModal, setActiveLegalModal] = useState<'privacy' | 'terms' | null>(null);
  const [workWithUsOpen, setWorkWithUsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      onShowToast('Por favor completa los campos de nombre y email profesional.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      onShowToast(`¡Solicitud enviada con éxito! Nos contactaremos a ${formData.email} en breve.`);
    }, 1000);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    onShowToast(`${label} copiado al portapapeles`);
  };

  return (
    <footer className="bg-[#0A0A0A] border-t border-[#2A2A2A] pt-24 pb-12 px-5 md:px-20 relative overflow-hidden" id="contacto">
      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D32F2F]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          {/* Left Column: Direct Info & Social */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#18181b] border border-[#27272a] rounded-full mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF3D3D] animate-pulse"></span>
                <span className="font-mono-custom text-xs text-[#FBC02D] uppercase tracking-wider font-bold">
                  Contacto Directo &amp; Asesoría
                </span>
              </div>

              <h2 className="font-display text-4xl sm:text-5xl font-black text-[#ffffff] leading-tight">
                Iniciemos el <br />
                <span className="fire-text">Discovery</span>
              </h2>

              <p className="font-body text-base md:text-lg text-[#cbd5e1] mt-4 max-w-md leading-relaxed">
                Cuéntanos sobre tu operación, tus desafíos de escalamiento o el producto SaaS que deseas construir.
              </p>
            </div>

            {/* Direct Contact List */}
            <div className="space-y-4">
              <div
                onClick={() => copyToClipboard('productosaas2026@gmail.com', 'Correo electrónico')}
                className="flex items-center gap-4 text-[#cbd5e1] hover:text-white transition-colors cursor-pointer group p-3 rounded-xl hover:bg-[#121214] border border-transparent hover:border-[#27272a]"
              >
                <div className="w-10 h-10 rounded-lg bg-[#27272a] flex items-center justify-center text-[#FF3D3D] group-hover:bg-[#FF3D3D] group-hover:text-white transition-all shadow">
                  <span className="material-symbols-outlined text-xl">mail</span>
                </div>
                <div>
                  <div className="font-mono-custom text-[11px] text-[#cbd5e1] uppercase font-bold">Email de proyectos</div>
                  <div className="font-body text-base font-bold text-[#ffffff]">productosaas2026@gmail.com</div>
                </div>
              </div>

              <a
                href="https://wa.me/51960442025?text=Hola!%2C%20requiero%20mas%20informaci%C3%B3n%20de%20ESCALIA%20y%20sus%20productos%20para%20mi%20negocio"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-[#cbd5e1] hover:text-white transition-colors cursor-pointer group p-3 rounded-xl hover:bg-[#121214] border border-transparent hover:border-[#27272a]"
              >
                <div className="w-10 h-10 rounded-lg bg-[#27272a] flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow">
                  <span className="material-symbols-outlined text-xl">forum</span>
                </div>
                <div>
                  <div className="font-mono-custom text-[11px] text-[#cbd5e1] uppercase font-bold">WhatsApp Directo</div>
                  <div className="font-body text-base font-bold text-[#ffffff]">+51 960 442 025</div>
                </div>
              </a>

              <a
                href="https://wa.me/584121961606?text=Hola!%2C%20requiero%20mas%20informaci%C3%B3n%20de%20ESCALIA%20y%20sus%20productos%20para%20mi%20negocio"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-[#cbd5e1] hover:text-white transition-colors cursor-pointer group p-3 rounded-xl hover:bg-[#121214] border border-transparent hover:border-[#27272a]"
              >
                <div className="w-10 h-10 rounded-lg bg-[#27272a] flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow">
                  <span className="material-symbols-outlined text-xl">forum</span>
                </div>
                <div>
                  <div className="font-mono-custom text-[11px] text-[#cbd5e1] uppercase font-bold">WhatsApp Directo</div>
                  <div className="font-body text-base font-bold text-[#ffffff]">+58 412 196 1606</div>
                </div>
              </a>

              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-[#e4beba] hover:text-white transition-colors cursor-pointer group p-2.5 rounded hover:bg-[#131313]"
              >
                <div className="w-10 h-10 rounded bg-[#201f1f] flex items-center justify-center text-[#FBC02D] group-hover:bg-[#FBC02D] group-hover:text-[#0A0A0A] transition-colors">
                  <span className="material-symbols-outlined text-xl">work</span>
                </div>
                <div>
                  <div className="font-mono-custom text-[11px] text-[#e4beba] uppercase">Red Profesional</div>
                  <div className="font-body text-base font-semibold text-[#e5e2e1]">LinkedIn ESCALIA</div>
                </div>
              </a>

              <div className="pt-2">
                <a
                  href="https://calendly.com/productosaas2026/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3.5 bg-[#27272a] border border-[#D32F2F]/40 text-[#FBC02D] hover:text-white font-mono-custom text-xs uppercase tracking-wider rounded-xl hover:bg-[#D32F2F] transition-all font-bold shadow-md cursor-pointer"
                >
                  <span className="material-symbols-outlined mr-2 text-base">calendar_month</span>
                  Agendar Cita en Calendly
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Calendly Booking Showcase */}
          <div className="bg-[#18181b] p-8 rounded-2xl border border-[#27272a] ambient-glow relative flex flex-col justify-between space-y-6 shadow-2xl">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00E676]/10 border border-[#00E676]/30">
                <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse"></span>
                <span className="font-mono-custom text-xs font-bold text-[#00E676] tracking-wider uppercase">
                  Calendly Sincronizado
                </span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-black text-white leading-tight">
                Reserva tu Cita de Discovery <br className="hidden sm:inline" />
                <span className="text-[#FBC02D]">sin compromiso para ayudarte a crecer tu negocio</span>
              </h3>

              <p className="font-body text-sm sm:text-base text-[#cbd5e1] leading-relaxed">
                Selecciona la fecha y hora disponible que mejor se adapte a tu agenda. Calendly sincroniza nuestro calendario en tiempo real para confirmar tu reunión de Discovery al instante.
              </p>

              <div className="bg-[#121214] p-4 rounded-xl border border-[#27272a] space-y-3 font-mono-custom text-xs">
                <div className="flex items-center gap-2.5 text-white">
                  <span className="material-symbols-outlined text-[#00E676] text-sm">check_circle</span>
                  <span>Selección rápida de horarios en tiempo real</span>
                </div>
                <div className="flex items-center gap-2.5 text-white">
                  <span className="material-symbols-outlined text-[#00E676] text-sm">check_circle</span>
                  <span>Confirmación inmediata con enlace de Google Meet</span>
                </div>
                <div className="flex items-center gap-2.5 text-white">
                  <span className="material-symbols-outlined text-[#00E676] text-sm">check_circle</span>
                  <span>Evaluación de viabilidad y arquitectura de tu SaaS</span>
                </div>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="space-y-3 pt-2">
              <a
                href="https://calendly.com/productosaas2026/30min"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onShowToast('Abriendo Calendly en una pestaña nueva...')}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 fire-gradient text-white font-mono-custom text-xs font-bold uppercase tracking-wider rounded-xl hover:brightness-110 transition-all shadow-xl hover:shadow-[#FF3D3D]/30 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">calendar_month</span>
                <span>Agendar Cita Directo en Calendly</span>
                <span className="material-symbols-outlined text-base">open_in_new</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Shared Bottom Component */}
        <div className="w-full py-10 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-[#353534]">
          <a href="#" className="opacity-90 hover:opacity-100 transition-opacity">
            <EscaliaLogo variant="dark" />
          </a>

          <div className="text-[#e4beba] font-body text-sm text-center md:text-left">
            © 2024 ESCALIA. De la idea al producto.
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <button
              onClick={() => setActiveLegalModal('privacy')}
              className="text-[#e4beba] hover:text-[#FBC02D] transition-colors"
            >
              Privacidad
            </button>
            <button
              onClick={() => setActiveLegalModal('terms')}
              className="text-[#e4beba] hover:text-[#FBC02D] transition-colors"
            >
              Términos
            </button>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#e4beba] hover:text-[#FBC02D] transition-colors"
            >
              LinkedIn
            </a>
            <button
              type="button"
              onClick={() => setWorkWithUsOpen(true)}
              className="text-[#e4beba] hover:text-[#FBC02D] transition-colors"
            >
              Trabaja con nosotros - experto en algún dominio
            </button>
            <a
              href="#contacto"
              className="text-[#ffb3ac] hover:text-[#FBC02D] transition-colors font-semibold"
            >
              Contacto
            </a>
            <a
              href="/admin/login"
              title="Acceso administrador"
              className="text-[#525252] hover:text-[#FBC02D] transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">lock</span>
              Admin
            </a>
          </div>
        </div>
      </div>

      {/* Modal Privacy / Terms */}
      {activeLegalModal && (
        <div className="fixed inset-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#131313] border border-[#2A2A2A] rounded-xl p-6 md:p-8 max-w-lg w-full space-y-4 relative">
            <button
              onClick={() => setActiveLegalModal(null)}
              className="absolute top-4 right-4 text-[#e4beba] hover:text-white p-2"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="font-display text-2xl font-bold text-[#e5e2e1]">
              {activeLegalModal === 'privacy' ? 'Política de Privacidad' : 'Términos y Condiciones'}
            </h3>
            <p className="font-body text-sm text-[#e4beba] leading-relaxed">
              {activeLegalModal === 'privacy'
                ? 'En ESCALIA Studio garantizamos el tratamiento confidencial de la información recolectada a través de nuestros canales de descubrimiento. Los datos solo se utilizan para evaluar requerimientos de software y establecer contacto profesional.'
                : 'Todas las relaciones de desarrollo y Growth Partner con ESCALIA se rigen bajo acuerdos NDA y contratos formales de entrega por hitos o acuerdos de compensación sobre resultados.'}
            </p>
            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setActiveLegalModal(null)}
                className="px-6 py-2 bg-[#201f1f] border border-[#2A2A2A] text-xs text-[#e5e2e1] font-mono-custom rounded hover:bg-[#2a2a2a]"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* "Trabaja con nosotros" Professional Lead Capture Modal */}
      <WorkWithUsModal
        open={workWithUsOpen}
        onClose={() => setWorkWithUsOpen(false)}
        onShowToast={onShowToast}
      />
    </footer>
  );
};

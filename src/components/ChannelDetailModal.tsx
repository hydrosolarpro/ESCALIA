import React from 'react';
import { Channel, ChannelApp } from '../types';

const AppCard: React.FC<{ app: ChannelApp }> = ({ app }) => {
  const [imgFailed, setImgFailed] = React.useState(false);
  const showImage = app.image && !imgFailed;

  return (
    <div className="rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] overflow-hidden">
      <div
        className="relative aspect-[16/7] flex items-end"
        style={{ background: `linear-gradient(135deg, ${app.brandColor}33, #0A0A0A 70%)` }}
      >
        {showImage && (
          <img
            src={app.image}
            alt={app.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/30 to-transparent" />
        <div className="relative p-4">
          <h6 className="font-display text-xl font-bold text-white">{app.name}</h6>
          <p className="font-mono-custom text-xs font-semibold" style={{ color: app.brandColor }}>
            {app.tagline}
          </p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <p className="font-body text-sm text-[#e4beba] leading-relaxed">{app.description}</p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {app.features.map((f) => (
            <li key={f} className="flex items-start gap-2 font-body text-xs text-[#e5e2e1]">
              <span className="material-symbols-outlined text-sm shrink-0" style={{ color: app.brandColor }}>
                check_circle
              </span>
              {f}
            </li>
          ))}
        </ul>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <a
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 fire-gradient text-white font-mono-custom text-xs font-bold uppercase tracking-wider rounded hover:opacity-90 flex items-center justify-center gap-2"
          >
            <span>{app.ctaLabel}</span>
            <span className="material-symbols-outlined text-xs">open_in_new</span>
          </a>
          {app.ctaNote && (
            <span className="font-mono-custom text-[11px] text-[#e4beba] text-center sm:text-left">{app.ctaNote}</span>
          )}
        </div>
      </div>
    </div>
  );
};

interface ChannelDetailModalProps {
  channel: Channel | null;
  onClose: () => void;
  onOpenAppointment: () => void;
}

export const ChannelDetailModal: React.FC<ChannelDetailModalProps> = ({
  channel,
  onClose,
  onOpenAppointment
}) => {
  if (!channel) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0A]/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#131313] border border-[#2A2A2A] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#e4beba] hover:text-white p-2 rounded hover:bg-[#201f1f]"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded bg-[#201f1f] flex items-center justify-center"
            style={{ color: channel.color }}
          >
            <span className="material-symbols-outlined text-2xl">
              {channel.icon}
            </span>
          </div>
          <div>
            <span
              className="font-mono-custom text-xs font-bold uppercase tracking-wider"
              style={{ color: channel.color }}
            >
              {channel.code}
            </span>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-[#e5e2e1]">
              {channel.title}
            </h3>
          </div>
        </div>

        {/* Hero image preview */}
        <div className="relative aspect-video rounded-lg overflow-hidden border border-[#2A2A2A]">
          <img
            src={channel.image}
            alt={channel.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent flex items-end p-4">
            <div className="flex flex-wrap gap-2">
              {channel.tags.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 bg-[#0A0A0A]/80 border border-[#2A2A2A] text-[#FBC02D] font-mono-custom text-xs rounded"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Full Details Text */}
        <div className="space-y-3">
          <h4 className="font-mono-custom text-xs text-[#e5e2e1] uppercase tracking-wider font-semibold">
            Descripción General
          </h4>
          <p className="font-body text-base text-[#e4beba] leading-relaxed">
            {channel.fullDetails}
          </p>
        </div>

        {/* Familias de negocio (Canal 1) */}
        {channel.families && (
          <div className="space-y-4">
            <h4 className="font-mono-custom text-xs text-[#e5e2e1] uppercase tracking-wider font-semibold">
              Familias de negocio
            </h4>
            {channel.families.map((family) => (
              <div key={family.title} className="p-5 bg-[#1c1b1b] rounded-lg border border-[#2A2A2A] space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 shrink-0 rounded bg-[#201f1f] flex items-center justify-center" style={{ color: channel.color }}>
                    <span className="material-symbols-outlined text-xl">{family.icon}</span>
                  </div>
                  <div>
                    <h5 className="font-display text-lg font-bold text-[#e5e2e1]">{family.title}</h5>
                    <p className="font-body text-sm text-[#e4beba] leading-relaxed mt-1">{family.examples}</p>
                  </div>
                </div>
                {family.app && <AppCard app={family.app} />}
              </div>
            ))}
          </div>
        )}

        {/* Apps con acceso DEMO (Canal 2) */}
        {channel.apps && (
          <div className="space-y-4">
            <h4 className="font-mono-custom text-xs text-[#e5e2e1] uppercase tracking-wider font-semibold">
              Apps listas para usar
            </h4>
            {channel.apps.map((app) => (
              <AppCard key={app.name} app={app} />
            ))}
          </div>
        )}

        {/* Case Study / Metrics Example */}
        {channel.caseStudyTitle && !channel.families && !channel.apps && (
          <div className="p-5 bg-[#1c1b1b] rounded-lg border border-[#2A2A2A] space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#F57C00]">insights</span>
              <h5 className="font-display text-base font-bold text-[#e5e2e1]">
                Caso de Éxito / Benchmark: {channel.caseStudyTitle}
              </h5>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {channel.caseStudyMetrics?.map((m) => (
                <div
                  key={m}
                  className="p-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded font-mono-custom text-xs text-[#FBC02D] text-center font-semibold"
                >
                  {m}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 border-t border-[#2A2A2A] flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#201f1f] border border-[#2A2A2A] text-[#e4beba] font-mono-custom text-xs rounded hover:bg-[#2a2a2a]"
          >
            Cerrar
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenAppointment();
            }}
            className="px-6 py-2.5 fire-gradient text-white font-mono-custom text-xs font-bold uppercase tracking-wider rounded hover:opacity-90 flex items-center justify-center gap-2"
          >
            <span>Agendar una cita gratis y sin compromiso · {channel.code}</span>
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

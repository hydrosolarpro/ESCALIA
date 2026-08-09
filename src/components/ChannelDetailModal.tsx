import React from 'react';
import { Channel } from '../types';

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

        {/* Case Study / Metrics Example */}
        {channel.caseStudyTitle && (
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
            <span>Iniciar Discovery para {channel.code}</span>
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { CHANNELS_DATA } from '../data/channelsData';
import { Tilt3D } from './Tilt3D';
import { Channel } from '../types';

interface FourChannelsProps {
  onSelectChannel: (channel: Channel) => void;
  onOpenAppointment: () => void;
}

export const FourChannels: React.FC<FourChannelsProps> = ({ onSelectChannel, onOpenAppointment }) => {
  return (
    <section className="py-24 px-5 md:px-20 overflow-hidden" id="canales">
      <div className="max-w-[1280px] mx-auto">
        {/* Section Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF3D3D] motion-safe:animate-pulse"></span>
              <span className="font-mono-custom text-xs text-[#FBC02D] uppercase tracking-widest font-bold">
                Estructura Operativa &amp; Canales
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-[#ffffff] tracking-tight leading-tight">
              Los Cuatro Canales
            </h2>
            <p className="font-body text-base md:text-xl text-[#cbd5e1] max-w-2xl mt-4 leading-relaxed">
              Nuestra arquitectura de soluciones está diseñada para escalar operaciones SaaS en diferentes niveles de madurez digital.
            </p>
          </div>

          <button
            onClick={onOpenAppointment}
            className="px-6 py-3.5 bg-[#18181b] border border-[#27272a] hover:border-[#D32F2F] text-[#FBC02D] hover:text-white font-mono-custom text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 self-start md:self-auto shadow-md"
          >
            <span>Consultar Canal Adecuado</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>

        {/* 2x2 Grid of Channels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CHANNELS_DATA.map((channel, i) => {
            const isHotCard = channel.id === 'canal-04';

            return (
              <Tilt3D key={channel.id} delay={(i % 2) * 120}>
              <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectChannel(channel); } }}
                onClick={() => onSelectChannel(channel)}
                className={`h-full p-8 rounded-xl border transition-all duration-300 group flex flex-col justify-between cursor-pointer relative overflow-hidden ${
                  isHotCard
                    ? 'bg-[#18181b] border-[#3f3f46] card-hot hover:border-[#F57C00] shadow-2xl'
                    : 'bg-[#121214] border-[#27272a] hover:border-[#D32F2F]/60 hover:bg-[#18181b]'
                }`}
              >
                {/* Background graphic for Hot Card */}
                {isHotCard && (
                  <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <span className="material-symbols-outlined text-9xl text-[#FF3D3D]">
                      trending_up
                    </span>
                  </div>
                )}

                <div className="relative z-10 flex flex-col h-full">
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${
                        isHotCard ? 'bg-[#D32F2F]/20 text-[#FF3D3D]' : 'bg-[#27272a] text-[#ffffff]'
                      } transition-all group-hover:scale-110 duration-300 shadow-inner`}
                      style={{ color: isHotCard ? '#FF3D3D' : channel.color }}
                    >
                      <span className="material-symbols-outlined text-2xl">
                        {channel.icon}
                      </span>
                    </div>

                    <span
                      className={`font-mono-custom text-xs uppercase tracking-wider font-bold px-2.5 py-1 rounded bg-[#09090b] border ${
                        isHotCard ? 'text-[#FF3D3D] border-[#D32F2F]/40' : 'text-[#FBC02D] border-[#27272a]'
                      }`}
                    >
                      {channel.code}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-display text-2xl font-bold text-[#ffffff] mb-3 group-hover:text-[#FBC02D] transition-colors tracking-tight">
                    {channel.title}
                  </h3>

                  <p className="font-body text-base text-[#cbd5e1] mb-6 leading-relaxed flex-grow font-normal">
                    {channel.description}
                  </p>

                  {/* Highlight statement if available */}
                  {isHotCard && (
                    <div className="p-3.5 rounded-lg bg-[#09090b]/80 border border-[#D32F2F]/40 mb-6 shadow-inner">
                      <p className="font-body text-sm font-semibold text-[#FBC02D] italic">
                        &ldquo;Escalamos tu negocio a éxito: solo ganamos si tú facturas más&rdquo;
                      </p>
                    </div>
                  )}

                  {/* Tags & Action CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#27272a] mt-auto">
                    <div className="flex flex-wrap gap-2">
                      {channel.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`px-3 py-1 font-mono-custom text-[11px] rounded-md font-medium ${
                            isHotCard
                              ? 'bg-[#09090b] border border-[#D32F2F]/40 text-[#FF3D3D]'
                              : 'bg-[#18181b] border border-[#27272a] text-[#cbd5e1]'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <span className="font-mono-custom text-xs text-[#FBC02D] font-bold flex items-center gap-1 group-hover:translate-x-1.5 transition-transform shrink-0 ml-2">
                      Casos de éxitos
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </span>
                  </div>
                </div>
              </div>
              </Tilt3D>
            );
          })}
        </div>
      </div>
    </section>
  );
};

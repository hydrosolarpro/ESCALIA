import React, { useState } from 'react';
import { PORTFOLIO_ITEMS } from '../data/portfolioData';
import { PortfolioItem } from '../types';

interface TransversalPortfolioProps {
  onOpenAppointment: () => void;
}

export const TransversalPortfolio: React.FC<TransversalPortfolioProps> = ({ onOpenAppointment }) => {
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  return (
    <section className="py-24 px-5 md:px-20 bg-[#0e0e0e] border-y border-[#2A2A2A]" id="servicios">
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="mb-16 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#18181b] border border-[#27272a] rounded-full">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F57C00] animate-pulse"></span>
            <span className="font-mono-custom text-xs text-[#FBC02D] uppercase tracking-wider font-bold">
              Servicios &amp; Capacidades Transversales
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-[#ffffff] tracking-tight">
            Portafolio Transversal
          </h2>

          <p className="font-body text-base md:text-xl text-[#cbd5e1] max-w-2xl mx-auto leading-relaxed">
            Capacidades técnicas y estratégicas aplicadas transversalmente en todos nuestros canales.
          </p>
        </div>

        {/* Bento Grid with Flexible Dynamic Auto Rows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PORTFOLIO_ITEMS.map((item) => {
            const isLarge = item.span.includes('col-span-2');

            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`${item.span} bg-[#121214] p-7 md:p-8 rounded-xl border border-[#27272a] hover:border-[#D32F2F]/60 flex flex-col justify-between relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-2xl min-h-[240px]`}
              >
                {/* Background decorative fire overlay for large items */}
                {isLarge ? (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#121214]/80 to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity fire-gradient mix-blend-overlay pointer-events-none"></div>
                  </>
                ) : (
                  <div className="absolute top-4 right-4 text-[#353534] group-hover:text-[#FF3D3D] transition-colors pointer-events-none">
                    <span className="material-symbols-outlined text-3xl opacity-30">
                      {item.icon}
                    </span>
                  </div>
                )}

                <div className="relative z-20 space-y-3">
                  <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                    <span
                      className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform shrink-0"
                      style={{ color: item.color }}
                    >
                      {item.icon}
                    </span>
                    <span className="font-mono-custom text-xs text-[#FBC02D] uppercase tracking-wider font-bold bg-[#18181b] px-3 py-1 rounded-md border border-[#27272a] shadow-sm">
                      Clic Para Explorar Detalle
                    </span>
                  </div>

                  <h3 className="font-display text-xl md:text-2xl font-bold text-[#ffffff] group-hover:text-[#FBC02D] transition-colors tracking-tight leading-snug">
                    {item.title}
                  </h3>

                  <p className="font-body text-sm md:text-base text-[#cbd5e1] leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal for Portfolio Item Details */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-[#131313] border border-[#2A2A2A] rounded-xl p-6 md:p-8 max-w-xl w-full shadow-2xl relative space-y-6">
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 text-[#e4beba] hover:text-white p-2 rounded hover:bg-[#201f1f]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded bg-[#201f1f] flex items-center justify-center"
                  style={{ color: selectedItem.color }}
                >
                  <span className="material-symbols-outlined text-2xl">
                    {selectedItem.icon}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-[#e5e2e1]">
                    {selectedItem.title}
                  </h3>
                  <span className="font-mono-custom text-xs text-[#FBC02D]">Capacidad Transversal ESCALIA</span>
                </div>
              </div>

              <p className="font-body text-base text-[#e4beba] leading-relaxed">
                {selectedItem.details}
              </p>

              <div>
                <h4 className="font-mono-custom text-xs text-[#e5e2e1] uppercase tracking-wider mb-3 font-semibold">
                  Entregables y Metodologías
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.capabilities.map((cap) => (
                    <span
                      key={cap}
                      className="px-3 py-1 bg-[#1c1b1b] border border-[#2A2A2A] text-[#FBC02D] font-mono-custom text-xs rounded"
                    >
                      ✓ {cap}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#2A2A2A] flex justify-end gap-3">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 border border-[#2A2A2A] text-[#e4beba] font-mono-custom text-xs rounded hover:bg-[#1c1b1b]"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    setSelectedItem(null);
                    onOpenAppointment();
                  }}
                  className="px-6 py-2 fire-gradient text-[#fff2f0] font-mono-custom text-xs uppercase font-bold rounded hover:opacity-90 flex items-center gap-2"
                >
                  <span>Solicitar Servicio</span>
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

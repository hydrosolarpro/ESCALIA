import React from 'react';

export const QuoteBanner: React.FC = () => {
  return (
    <section className="py-16 md:py-20 bg-[#0e0e11] border-y border-[#27272a] px-5 md:px-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-radial from-[#D32F2F]/10 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="max-w-[1280px] mx-auto text-center space-y-4 relative z-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#18181b] border border-[#27272a] text-[#FF3D3D] mb-1 shadow-2xl">
          <span className="material-symbols-outlined text-2xl">rocket_launch</span>
        </div>

        <blockquote className="font-display text-2xl sm:text-3xl md:text-4xl text-[#ffffff] max-w-4xl mx-auto leading-snug font-extrabold italic tracking-tight drop-shadow-sm">
          &ldquo;Transformamos procesos manuales e ideas de negocio en <span className="fire-text">activos digitales escalables</span> con arquitectura de alto rendimiento.&rdquo;
        </blockquote>

        <div className="pt-2 flex items-center justify-center gap-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#FF3D3D]"></div>
          <span className="font-mono-custom text-xs text-[#FBC02D] uppercase tracking-widest font-bold">
            Filosofía ESCALIA Studio
          </span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#FF3D3D]"></div>
        </div>
      </div>
    </section>
  );
};


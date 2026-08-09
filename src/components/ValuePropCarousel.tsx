import React, { useState, useEffect, useRef } from 'react';
import { CHANNELS_DATA } from '../data/channelsData';
import { Channel } from '../types';

interface ValuePropCarouselProps {
  onSelectChannel: (channel: Channel) => void;
}

export const ValuePropCarousel: React.FC<ValuePropCarouselProps> = ({ onSelectChannel }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % CHANNELS_DATA.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const width = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollTo({
        left: activeSlide * width,
        behavior: 'smooth'
      });
    }
  }, [activeSlide]);

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % CHANNELS_DATA.length);
  };

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + CHANNELS_DATA.length) % CHANNELS_DATA.length);
  };

  return (
    <section className="relative pt-24 pb-12 md:pt-28 md:pb-14 bg-[#131313] overflow-hidden border-b border-[#2A2A2A]">
      <div className="max-w-[1280px] mx-auto px-5 md:px-20">
        
        {/* ESCALIA Header Banner Before Carousel */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c1c20] border border-[#333338] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#FF3D3D] animate-pulse"></span>
            <span className="font-mono-custom text-xs text-[#FBC02D] font-bold tracking-widest uppercase">
              ESCALIA Growth Studio • 2026
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            SaaS Development &amp;<br className="hidden sm:inline" /> Growth Studio
          </h2>

          <p className="font-mono-custom text-xs sm:text-sm text-[#60a5fa] font-bold tracking-wider uppercase">
            • De la idea al producto • Del producto al crecimiento exponencial •
          </p>
        </div>

        {/* Carousel Header Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF3D3D] animate-pulse"></span>
            <h3 className="font-mono-custom text-xs text-[#FBC02D] uppercase tracking-widest font-bold">
              Propuesta de Valor Visual • Los 4 Canales en Acción
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1.5 text-[#cbd5e1] hover:text-[#FBC02D] transition-colors rounded hover:bg-[#2A2A2A]"
              title={isPaused ? "Reanudar auto-reproducción" : "Pausar auto-reproducción"}
            >
              <span className="material-symbols-outlined text-lg">
                {isPaused ? 'play_arrow' : 'pause'}
              </span>
            </button>
            <button
              onClick={handlePrev}
              className="p-2 bg-[#201f1f] border border-[#2A2A2A] hover:border-[#D32F2F] text-[#f1f5f9] rounded transition-colors"
              aria-label="Anterior canal"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
            </button>
            <button
              onClick={handleNext}
              className="p-2 bg-[#201f1f] border border-[#2A2A2A] hover:border-[#D32F2F] text-[#f1f5f9] rounded transition-colors"
              aria-label="Siguiente canal"
            >
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Carousel Content */}
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 hide-scrollbar scroll-smooth"
        >
          {CHANNELS_DATA.map((channel, idx) => (
            <div
              key={channel.id}
              onClick={() => onSelectChannel(channel)}
              className="min-w-full shrink-0 snap-start relative aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden border border-[#2A2A2A] hover:border-[#D32F2F]/60 cursor-pointer group transition-all"
            >
              <img
                src={channel.image}
                alt={channel.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent flex flex-col justify-end p-6 md:p-10">
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="font-mono-custom text-xs uppercase tracking-widest font-bold px-3 py-1.5 rounded-lg bg-[#0A0A0A]/90 border border-[#2A2A2A] shadow-md"
                    style={{ color: channel.color }}
                  >
                    {channel.code}: {channel.title}
                  </span>

                  <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-[#FBC02D] font-mono-custom font-semibold opacity-0 group-hover:opacity-100 transition-opacity bg-[#0A0A0A]/90 px-3.5 py-1.5 rounded-lg border border-[#2A2A2A] shadow-md">
                    Ver Detalles de Canal
                    <span className="material-symbols-outlined text-xs">open_in_new</span>
                  </span>
                </div>

                <p className="text-base md:text-lg text-[#f1f5f9] font-body max-w-3xl line-clamp-2 leading-relaxed font-normal drop-shadow-md">
                  {channel.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {CHANNELS_DATA.map((channel, idx) => (
            <button
              key={channel.id}
              onClick={() => setActiveSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeSlide === idx
                  ? 'w-10 bg-[#D32F2F]'
                  : 'w-6 bg-[#2A2A2A] hover:bg-[#5b403d]'
              }`}
              aria-label={`Ir a canal ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

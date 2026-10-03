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
    if (isPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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
    <section className="relative py-14 md:py-16 bg-[#131313] overflow-hidden border-b border-[#2A2A2A]">
      <div className="max-w-[1280px] mx-auto px-5 md:px-20">
        
        {/* Carousel Header Controls */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl md:text-2xl font-extrabold text-white tracking-tight">Los 4 canales en acción</h2>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              aria-label={isPaused ? "Reanudar auto-reproducción" : "Pausar auto-reproducción"}
              className="p-2.5 text-[#cbd5e1] hover:text-[#FBC02D] transition-colors rounded hover:bg-[#2A2A2A]"
              title={isPaused ? "Reanudar auto-reproducción" : "Pausar auto-reproducción"}
            >
              <span className="material-symbols-outlined text-lg">
                {isPaused ? 'play_arrow' : 'pause'}
              </span>
            </button>
            <button
              onClick={handlePrev}
              className="p-2.5 bg-[#201f1f] border border-[#2A2A2A] hover:border-[#D32F2F] text-[#f1f5f9] rounded transition-colors"
              aria-label="Anterior canal"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
            </button>
            <button
              onClick={handleNext}
              className="p-2.5 bg-[#201f1f] border border-[#2A2A2A] hover:border-[#D32F2F] text-[#f1f5f9] rounded transition-colors"
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
          onFocus={() => setIsPaused(true)}
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 hide-scrollbar scroll-smooth"
        >
          {CHANNELS_DATA.map((channel, idx) => (
            <div
              key={channel.id}
              role="button"
              tabIndex={0}
              aria-label={`Ver detalles: ${channel.title}`}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectChannel(channel); } }}
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
              className={`h-2 rounded-full transition-all duration-300 ${
                activeSlide === idx
                  ? 'w-10 bg-[#D32F2F]'
                  : 'w-6 bg-[#3f3f46] hover:bg-[#71717a]'
              }`}
              aria-label={`Ir a canal ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

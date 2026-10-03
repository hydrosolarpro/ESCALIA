import React, { useEffect, useRef } from 'react';

/**
 * Fixed full-page background with a 3D embossed "terrain" relief (SVG lighting
 * filter) and a perspective grid floor. Sits behind all content and drifts
 * slightly with scroll for depth.
 */
export const BackgroundRelief: React.FC = () => {
  const reliefRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (reliefRef.current) {
          reliefRef.current.style.transform = `translate3d(0, ${-window.scrollY * 0.06}px, 0) scale(1.15)`;
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Embossed terrain relief */}
      <div ref={reliefRef} className="bg-relief-layer absolute inset-0 will-change-transform" style={{ transform: 'scale(1.15)' }}>
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <defs>
            <filter id="terrain-relief" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.0045 0.007" numOctaves="5" seed="11" result="noise" />
              <feDiffuseLighting in="noise" surfaceScale="22" diffuseConstant="1.15" lightingColor="#ff6a1f">
                <feDistantLight azimuth="235" elevation="32" />
              </feDiffuseLighting>
            </filter>
          </defs>
          <rect width="100%" height="100%" filter="url(#terrain-relief)" />
        </svg>
      </div>

      {/* Darken + vignette so text stays readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(10,10,10,0.4)_0%,rgba(10,10,10,0.88)_80%)]" />

      {/* Perspective grid floor */}
      <div className="bg-grid-floor-wrap absolute inset-x-0 bottom-0 h-[55vh]">
        <div className="bg-grid-floor" />
      </div>
    </div>
  );
};

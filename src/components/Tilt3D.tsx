import React, { useRef, useEffect, useState } from 'react';

interface Tilt3DProps {
  children: React.ReactNode;
  className?: string;
  max?: number;
  /** Delay in ms for the 3D reveal on scroll */
  delay?: number;
}

const canTilt = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches;

/**
 * Wrapper that reveals its child with a 3D flip-in on scroll and tilts it
 * toward the cursor with a moving glare. Tilt is disabled on touch devices
 * and when the user prefers reduced motion.
 */
export const Tilt3D: React.FC<Tilt3DProps> = ({ children, className = '', max = 8, delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !canTilt()) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--ry', `${(px - 0.5) * max * 2}deg`);
    el.style.setProperty('--rx', `${(0.5 - py) * max * 2}deg`);
    el.style.setProperty('--gx', `${px * 100}%`);
    el.style.setProperty('--gy', `${py * 100}%`);
    el.style.setProperty('--glare', '1');
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--glare', '0');
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`tilt3d ${visible ? 'tilt3d-in' : 'tilt3d-pre'} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : undefined }}
    >
      <div className="tilt3d-inner h-full">
        {children}
        <span className="tilt3d-glare" aria-hidden="true" />
      </div>
    </div>
  );
};

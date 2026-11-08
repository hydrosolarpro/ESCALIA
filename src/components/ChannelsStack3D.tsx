import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  MotionValue
} from 'motion/react';
import { CHANNELS_DATA } from '../data/channelsData';
import { Channel } from '../types';

/**
 * Idea: los 4 canales son 4 capas de una misma pila. Cada capa que subes
 * escala tu negocio un nivel. Al hacer scroll la pila se separa en el aire y
 * se ilumina capa por capa; el cursor la gira (con resorte, es decorativo).
 *
 * Escritorio con movimiento: escena fija mientras avanza el scroll.
 * Móvil o "reducir movimiento": pila estática, ya separada, sin fijar nada.
 */

const SLAB_W = 360;
const SLAB_H = 220;
const EDGE_LAYERS = [4, 8, 12, 16];

const darken = (hex: string, amt: number) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.round(v * (1 - amt)));
  const r = f((n >> 16) & 255);
  const g = f((n >> 8) & 255);
  const b = f(n & 255);
  return `rgb(${r}, ${g}, ${b})`;
};

const SlabView: React.FC<{
  channel: Channel;
  index: number;
  gap: MotionValue<number>;
  active: boolean;
  dimmed: boolean;
  onSelect: () => void;
}> = ({ channel, index, gap, active, dimmed, onSelect }) => {
  const z = useTransform(gap, (g: number) => g * index);

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{ z, x: '-50%', y: '-50%', width: SLAB_W, height: SLAB_H, transformStyle: 'preserve-3d' }}
    >
      {/* Lift + brightness live on a CSS transition so they retarget smoothly mid-scroll */}
      <button
        type="button"
        onClick={onSelect}
        aria-label={`${channel.code}: ${channel.title}. Ver detalle`}
        className="stack-slab absolute inset-0 block text-left cursor-pointer"
        style={{
          transformStyle: 'preserve-3d',
          transform: `translateZ(${active ? 26 : 0}px)`,
          transition: 'transform 420ms cubic-bezier(0.23, 1, 0.32, 1), opacity 300ms ease-out',
          opacity: dimmed ? 0.74 : 1
        }}
      >
        {/* Extrusion: stacked darker copies give the slab real thickness */}
        {EDGE_LAYERS.map((d, i) => (
          <span
            key={d}
            aria-hidden="true"
            className="absolute inset-0 rounded-md"
            style={{ transform: `translateZ(${-d}px)`, background: darken(channel.color, 0.45 + i * 0.1) }}
          />
        ))}

        {/* Top face */}
        <span
          className="absolute inset-0 rounded-md p-6 flex flex-col justify-between"
          style={{
            background: active ? `linear-gradient(150deg, ${channel.color}38, #17171a 62%)` : '#141416',
            border: `1px solid ${channel.color}${active ? 'cc' : '55'}`,
            boxShadow: active ? `0 0 0 1px ${channel.color}33` : 'none',
            transition: 'background 300ms ease-out, border-color 300ms ease-out'
          }}
        >
          <span className="flex items-center justify-between">
            <span
              className="font-mono-custom text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-[#09090b]"
              style={{ color: channel.color }}
            >
              {channel.code}
            </span>
            <span className="material-symbols-outlined text-2xl" style={{ color: channel.color }} aria-hidden="true">
              {channel.icon}
            </span>
          </span>
          <span className="font-display text-2xl font-extrabold text-white leading-tight tracking-tight">
            {channel.title}
          </span>
        </span>
      </button>
    </motion.div>
  );
};

interface ChannelsStack3DProps {
  onSelectChannel: (channel: Channel) => void;
}

export const ChannelsStack3D: React.FC<ChannelsStack3DProps> = ({ onSelectChannel }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
    const sync = () => setAnimated(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start start', 'end end'] });
  const staticProgress = useMotionValue(0.5);
  const progress = animated ? scrollYProgress : staticProgress;

  // The stack opens up in the first third of the scroll, then holds while each layer lights up.
  const gap = useTransform(progress, [0, 0.3], animated ? [10, 96] : [96, 96], { clamp: true });
  const groundOpacity = useTransform(progress, [0, 0.3], [0.35, 0.7]);

  // Cursor-driven yaw, sprung so it keeps momentum instead of snapping.
  const mx = useMotionValue(0);
  const yaw = useSpring(useTransform(mx, [-1, 1], [-46, -30]), { stiffness: 90, damping: 16 });
  const scrollYaw = useTransform(progress, [0, 1], animated ? [6, -6] : [0, 0]);
  const rotateZ = useTransform([yaw, scrollYaw], ([a, b]: number[]) => a + b);

  useMotionValueEvent(progress, 'change', (v) => {
    if (!animated) return;
    const next = Math.min(CHANNELS_DATA.length - 1, Math.max(0, Math.floor(v * CHANNELS_DATA.length)));
    setActive((cur) => (cur === next ? cur : next));
  });

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!animated) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
  };

  const current = CHANNELS_DATA[active];

  return (
    <div ref={wrapRef} className={animated ? 'relative h-[280vh]' : 'relative'} aria-label="Los cuatro canales como capas de una pila">
      <div
        className={
          animated
            ? 'sticky top-20 h-[calc(100vh-5rem)] flex items-center'
            : 'flex flex-col gap-10 items-center'
        }
      >
        <div className="w-full grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-6 md:gap-10 items-center">
          {/* Copy that follows the active layer */}
          <div className="order-2 md:order-1 min-h-[220px]">
            <div className="flex items-center gap-3 mb-4">
              <span
                className="font-mono-custom text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-[#09090b] border border-[#27272a]"
                style={{ color: current.color }}
              >
                {current.code}
              </span>
              <span className="font-mono-custom text-xs text-[#cbd5e1]">
                Capa {active + 1} de {CHANNELS_DATA.length}
              </span>
            </div>
            <h3
              key={current.id}
              className="font-display text-3xl md:text-4xl font-black text-white tracking-tight leading-[1.08] stack-copy-in"
            >
              {current.title}
            </h3>
            <p key={`${current.id}-p`} className="font-body text-base md:text-lg text-[#cbd5e1] leading-relaxed mt-4 max-w-md stack-copy-in line-clamp-5">
              {current.description.split('. Forma de pago')[0]}.
            </p>
            <button
              type="button"
              onClick={() => onSelectChannel(current)}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 fire-gradient text-white font-mono-custom text-xs font-bold uppercase tracking-wider rounded-lg hover:brightness-110 cta-press"
            >
              <span>Ver casos de éxito de {current.code}</span>
              <span className="material-symbols-outlined text-base" aria-hidden="true">arrow_forward</span>
            </button>
          </div>

          {/* 3D stage */}
          <div
            className="order-1 md:order-2 relative h-[340px] sm:h-[420px] md:h-[min(560px,70vh)]"
            style={{ perspective: 1500 }}
            onPointerMove={onPointerMove}
          >
            <div className="absolute inset-0 flex items-center justify-center scale-[0.62] sm:scale-[0.78] md:scale-100 origin-center">
              <motion.div
                className="relative"
                style={{
                  width: SLAB_W,
                  height: SLAB_H,
                  transformStyle: 'preserve-3d',
                  rotateX: 58,
                  rotateZ
                }}
              >
                {/* Ground shadow: offset + soft blur, grows as the stack opens */}
                <motion.span
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 rounded-full"
                  style={{
                    width: SLAB_W * 1.1,
                    height: SLAB_H * 1.1,
                    x: '-46%',
                    y: '-44%',
                    z: -40,
                    background: 'rgba(0,0,0,0.85)',
                    filter: 'blur(34px)',
                    opacity: groundOpacity
                  }}
                />
                {CHANNELS_DATA.map((channel, i) => (
                  <SlabView
                    key={channel.id}
                    channel={channel}
                    index={i}
                    gap={gap}
                    active={animated ? i === active : false}
                    dimmed={animated ? i !== active : false}
                    onSelect={() => onSelectChannel(channel)}
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

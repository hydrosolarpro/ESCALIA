import React, { useState, useRef, useEffect } from 'react';

interface HeroProps {
  onOpenAppointment: () => void;
}

interface NexusNode {
  id: string;
  label: string;
  x: number; // percentage
  y: number; // percentage
  icon: string;
  metric: string;
  detail: string;
}

export const Hero: React.FC<HeroProps> = ({ onOpenAppointment }) => {
  // 3D Tilt State
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Dynamic visual mode for Nexus card: 'scanner' | 'nodes' | 'spectrum'
  const [nexusMode, setNexusMode] = useState<'scanner' | 'nodes' | 'spectrum'>('scanner');
  const [activeNode, setActiveNode] = useState<NexusNode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Canvas ref for particle effect
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Nexus Interactive Target Nodes
  const nexusNodes: NexusNode[] = [
    {
      id: 'core',
      label: 'SaaS Architecture Core',
      x: 32,
      y: 28,
      icon: 'developer_board',
      metric: '99.9% Uptime',
      detail: 'Infraestructura cloud multi-tenant con aislamiento de datos y auto-scaling.'
    },
    {
      id: 'traffic',
      label: 'Acquisition & Traffic Engine',
      x: 72,
      y: 35,
      icon: 'hub',
      metric: '+340% Conversión',
      detail: 'Canales de adquisición pagada y orgánica optimizados para captación de clientes.'
    },
    {
      id: 'monetization',
      label: 'Monetization & Billing AI',
      x: 25,
      y: 68,
      icon: 'payments',
      metric: 'Revenue Share Engine',
      detail: 'Integración avanzada con Stripe, cobros recurrentes y analítica MRR/ARR.'
    },
    {
      id: 'scaling',
      label: 'Nexus Growth Pipeline',
      x: 68,
      y: 72,
      icon: 'trending_up',
      metric: 'Scale Factor 4.8x',
      detail: 'Optimización continua de retención (Churn < 2%) y crecimiento acelerado.'
    }
  ];

  // Particle Canvas effect inside the Nexus card
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth || 500);
    let height = (canvas.height = canvas.offsetHeight || 350);

    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
    }> = [];

    const colors = ['#D32F2F', '#F57C00', '#FBC02D', '#FF3D3D'];

    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        alpha: Math.random() * 0.7 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connecting laser mesh lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 85) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(211, 47, 47, ${0.25 * (1 - dist / 85)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particle dots
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || 500;
      height = canvas.height = canvas.offsetHeight || 350;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle Mouse Movement for 3D Tilt Effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12; // max tilt degrees
    const rotateY = ((x - centerX) / centerX) * 12;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ x: rotateX, y: rotateY, glareX, glareY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50 });
  };

  return (
    <section className="relative py-14 md:py-20 px-5 md:px-20 min-h-screen flex items-center overflow-hidden bg-[#0A0A0A]">
      {/* Background ambient light glowing effects */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#D32F2F]/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-10 w-[500px] h-[500px] bg-[#F57C00]/15 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-[1280px] mx-auto w-full flex items-center relative z-10">

        {/* Hero Central Column with High Legibility & Visual Balance */}
        <div className="max-w-4xl mx-auto space-y-8 relative z-20 w-full">
          
          {/* Philosophy Quote Block (matching QuoteBanner format) */}
          <div className="bg-[#121215] border border-[#27272a] p-5 sm:p-6 rounded-2xl max-w-xl text-left shadow-2xl space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF3D3D]/10 rounded-full blur-2xl pointer-events-none"></div>
            <blockquote className="font-display text-lg sm:text-xl text-[#ffffff] leading-snug font-extrabold italic tracking-tight drop-shadow-sm">
              &ldquo;Transformamos procesos manuales e ideas de negocio en <span className="fire-text">activos digitales escalables</span> con arquitectura de alto rendimiento.&rdquo;
            </blockquote>
            <div className="pt-1 flex items-center gap-3">
              <div className="h-px w-10 bg-gradient-to-r from-[#FF3D3D] to-transparent"></div>
              <span className="font-mono-custom text-xs text-[#FBC02D] uppercase tracking-widest font-bold">
                Filosofía ESCALIA Studio
              </span>
              <div className="h-px w-10 bg-gradient-to-l from-[#FF3D3D] to-transparent"></div>
            </div>
          </div>

          {/* Dynamic Interactive "Nexus Evolution Active" Artwork (Placed Before Lead Paragraph) */}
          <div className="relative perspective-1000 my-6">
            
            {/* Outer glowing aura */}
            <div className={`absolute inset-0 rounded-2xl z-0 blur-3xl transition-opacity duration-500 ${
              nexusMode === 'spectrum' ? 'opacity-80 neon-border-pulse bg-gradient-to-tr from-[#FF3D3D] via-[#FF8A00] to-[#FBC02D]' : 'opacity-40 bg-gradient-to-tr from-[#D32F2F] to-[#F57C00]'
            }`}></div>

            {/* Interactive Card Container with 3D Tilt */}
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: isHovered
                  ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`
                  : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
                transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)'
              }}
              className="relative z-10 rounded-2xl overflow-hidden border border-[#3f3f46] bg-[#121214] shadow-2xl group select-none"
            >
              {/* Dynamic Glare Reflection Overlay */}
              {isHovered && (
                <div
                  className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 65%)`
                  }}
                ></div>
              )}

              {/* Interactive Mode Control Bar Header */}
              <div className="bg-[#18181b]/90 backdrop-blur-md px-4 py-2.5 border-b border-[#27272a] flex items-center justify-between relative z-20">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00E676] animate-pulse"></span>
                  <span className="font-mono-custom text-xs font-bold text-[#00E676] tracking-wider uppercase">
                    NEXUS EVOLUTION ACTIVE
                  </span>
                </div>

                {/* Mode Switcher Buttons */}
                <div className="flex items-center gap-1 bg-[#09090b] p-1 rounded-lg border border-[#27272a]">
                  <button
                    onClick={() => setNexusMode('scanner')}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono-custom font-semibold transition-all flex items-center gap-1 ${
                      nexusMode === 'scanner'
                        ? 'bg-[#D32F2F] text-white shadow'
                        : 'text-[#a1a1aa] hover:text-white'
                    }`}
                    title="Activar escáner holográfico"
                  >
                    <span className="material-symbols-outlined text-xs">radar</span>
                    <span>Escáner</span>
                  </button>

                  <button
                    onClick={() => setNexusMode('nodes')}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono-custom font-semibold transition-all flex items-center gap-1 ${
                      nexusMode === 'nodes'
                        ? 'bg-[#F57C00] text-white shadow'
                        : 'text-[#a1a1aa] hover:text-white'
                    }`}
                    title="Explorar nodos de arquitectura"
                  >
                    <span className="material-symbols-outlined text-xs">adjust</span>
                    <span>Nodos</span>
                  </button>

                  <button
                    onClick={() => setNexusMode('spectrum')}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono-custom font-semibold transition-all flex items-center gap-1 ${
                      nexusMode === 'spectrum'
                        ? 'bg-[#FBC02D] text-[#0A0A0A] font-bold shadow'
                        : 'text-[#a1a1aa] hover:text-white'
                    }`}
                    title="Modo Cyber Spectrum"
                  >
                    <span className="material-symbols-outlined text-xs">graphic_eq</span>
                    <span>Matrix</span>
                  </button>
                </div>
              </div>

              {/* Main Image Showcase with Canvas & Interactive Overlays */}
              <div className="relative overflow-hidden aspect-[16/10] sm:aspect-[16/9]">
                {/* Background Base Image */}
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKvBAnwaNvs6v9kCNV95yMMtUYZcS7MgTPPwR3kLn_8szDA_eQkGIQCrmDIPqy8KuZ2sLtFxAwmeiE2eIUE6euzsA1Y2Cc0xocXo4IT8G9kE7cLYsrWyTmPOBi7i3fNSh-JZgGxxyivYtnShF190eKYnfR430jmDCc5C7FriQgiKPYxdwOGXqt5dH44fNed0RRDPb02prYh-YLZO-1BdkGKcjqEpxRlSzannGdhXE8MwaW_J89N92L7w"
                  alt="NEXUS EVOLUTION - Hyper-Growth Initiative Studio"
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    nexusMode === 'spectrum' ? 'filter contrast-125 saturate-150 brightness-90' : 'brightness-95'
                  }`}
                  loading="eager"
                />

                {/* Particle Canvas Overlay */}
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 pointer-events-none z-10 w-full h-full"
                />

                {/* MODE 1: SCANNER - Holographic Laser Beam Sweep */}
                {nexusMode === 'scanner' && (
                  <div className="absolute inset-0 pointer-events-none z-20">
                    {/* Laser Line */}
                    <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF3D3D] to-transparent shadow-[0_0_15px_#FF3D3D] laser-beam"></div>
                    
                    {/* Telemetry Grid Overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(#FF3D3D_1px,transparent_1px)] [background-size:20px_20px] opacity-15"></div>

                    {/* Top-left Telemetry HUD readout */}
                    <div className="absolute top-3 left-3 bg-[#09090b]/80 border border-[#D32F2F]/40 p-2 rounded backdrop-blur-md font-mono-custom text-[10px] text-[#e2e8f0] space-y-0.5">
                      <div className="text-[#FBC02D] font-bold">LIVE TELEMETRY READOUT</div>
                      <div>FPS: <span className="text-emerald-400 font-bold">60.0</span> | STATUS: <span className="text-emerald-400 font-bold">OPTIMAL</span></div>
                      <div>LATENCY: <span className="text-emerald-400 font-bold">12ms</span> | AI ENGINE: <span className="text-emerald-400 font-bold">READY</span></div>
                    </div>
                  </div>
                )}

                {/* MODE 2: NODES - Interactive Map Target Pins */}
                {nexusMode === 'nodes' && (
                  <div className="absolute inset-0 z-20">
                    {nexusNodes.map((node) => {
                      const isSelected = activeNode?.id === node.id;
                      return (
                        <div
                          key={node.id}
                          style={{ left: `${node.x}%`, top: `${node.y}%` }}
                          onClick={() => setActiveNode(isSelected ? null : node)}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group/pin"
                        >
                          {/* Pulse Ring */}
                          <div className="absolute inset-0 rounded-full bg-[#F57C00] animate-ping opacity-75"></div>

                          {/* Node Target Pin Button */}
                          <div className={`relative w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-[#FF3D3D] border-white scale-125 shadow-[0_0_20px_#FF3D3D]'
                              : 'bg-[#09090b]/90 border-[#F57C00] hover:scale-110 text-[#FBC02D]'
                          }`}>
                            <span className="material-symbols-outlined text-sm">
                              {node.icon}
                            </span>
                          </div>

                          {/* Node Label Tooltip */}
                          <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2.5 bg-[#09090b]/95 border border-[#F57C00] rounded-lg shadow-2xl backdrop-blur-md transition-all ${
                            isSelected ? 'opacity-100 scale-100 z-30' : 'opacity-0 scale-95 pointer-events-none group-hover/pin:opacity-100 group-hover/pin:scale-100'
                          }`}>
                            <div className="font-display text-xs font-bold text-white">{node.label}</div>
                            <div className="font-mono-custom text-[10px] text-[#FBC02D] font-bold mt-0.5">{node.metric}</div>
                            <p className="font-body text-[11px] text-[#cbd5e1] mt-1 leading-tight">{node.detail}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* MODE 3: SPECTRUM - Cyber Grid Overlay */}
                {nexusMode === 'spectrum' && (
                  <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
                    <div className="w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 rounded-full border border-[#FF3D3D]/40 animate-spin" style={{ animationDuration: '12s' }}></div>
                      <div className="absolute w-36 h-36 rounded-full border border-[#FBC02D]/40 animate-ping opacity-30"></div>
                    </div>
                  </div>
                )}

                {/* Top-Right Badge Indicator */}
                <div className="absolute top-3 right-3 z-20 bg-[#09090b]/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#27272a] flex items-center gap-2 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse"></span>
                  <span className="font-mono-custom text-[11px] text-[#00E676] font-bold">ENGINE v4.8</span>
                </div>

                {/* Bottom Interactive Floating Telemetry Bar */}
                <div className="absolute bottom-3 left-3 right-3 z-20 bg-[#121214]/90 backdrop-blur-md p-3.5 rounded-xl border border-[#27272a] flex items-center justify-between shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#D32F2F]/20 text-[#FF3D3D] flex items-center justify-center border border-[#D32F2F]/30 shadow-inner">
                      <span className="material-symbols-outlined text-xl">rocket_launch</span>
                    </div>
                    <div>
                      <div className="font-display text-xs font-bold text-white flex items-center gap-1.5">
                        <span>SaaS Growth Architecture</span>
                        <span className="font-mono-custom text-[10px] text-[#FBC02D] bg-[#27272a] px-1.5 py-0.5 rounded">HYPER-GROWTH</span>
                      </div>
                      <div className="font-mono-custom text-[11px] text-[#cbd5e1] mt-0.5">
                        Desarrollo + Tráfico + Monetización AI
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-3.5 py-2 bg-[#27272a] hover:bg-[#D32F2F] text-[#FBC02D] hover:text-white font-mono-custom text-[11px] font-bold rounded-lg transition-all flex items-center gap-1.5 shadow"
                  >
                    <span>Ampliar</span>
                    <span className="material-symbols-outlined text-xs">fullscreen</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lead Paragraph with High Legibility */}
          <p className="font-body text-lg md:text-xl text-[#ffffff] max-w-xl leading-relaxed font-medium">
            No desarrollamos software solamente. Construimos <strong className="text-[#ffffff] font-bold underline decoration-[#FF3D3D] underline-offset-4">productos <span className="whitespace-nowrap">SaaS</span> orientados a automatizar y digitalizar el negocio para su crecimiento y escalamiento.</strong>
          </p>

          {/* Prominent SaaS Definition Card at Top of Page */}
          <div className="bg-[#121215] border border-[#27272a] hover:border-[#3f3f46] p-5 rounded-xl max-w-xl space-y-2.5 text-left shadow-xl backdrop-blur-md transition-all">
            <div className="flex items-center gap-2 text-[#FBC02D]">
              <span className="material-symbols-outlined text-base">cloud_done</span>
              <span className="font-mono-custom text-xs uppercase font-bold tracking-wider">
                ¿Qué es un producto tipo SaaS?
              </span>
            </div>
            <p className="font-body text-xs sm:text-sm text-[#e2e8f0] leading-relaxed">
              Un producto tipo <strong className="text-white font-bold">SaaS</strong> significa que es un <strong className="text-[#60a5fa] font-semibold">Software como Servicio (Software as a Service)</strong>. Es un producto que usa programas con automatizaciones e IA integrados a través de internet. <span className="text-[#ffffff] font-medium">Completamente en línea</span>, por lo que no tienes que instalar nada en tu computadora o laptop. Pagas una cuota mensual, trimestral o anual para entrar al sistema desde un navegador Web (Computadora, Laptop o Smartphone).
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-2">
            <a
              href="https://calendly.com/productosaas2026/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 fire-gradient text-[#ffffff] font-mono-custom text-xs font-bold uppercase tracking-wider rounded-lg hover:brightness-110 transition-all shadow-xl hover:shadow-[#D32F2F]/40 cursor-pointer group transform hover:-translate-y-0.5"
            >
              <span className="material-symbols-outlined mr-2 text-lg">calendar_month</span>
              <span>Agendar Cita en Calendly</span>
              <span className="material-symbols-outlined ml-2 text-base group-hover:translate-x-1 transition-transform">
                open_in_new
              </span>
            </a>

            <a
              href="#canales"
              className="inline-flex items-center justify-center px-7 py-4 bg-[#18181b] border border-[#27272a] text-[#FBC02D] hover:text-[#ffffff] font-mono-custom text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-[#27272a] hover:border-[#FBC02D]/50 transition-all cursor-pointer"
            >
              Explorar 4 Canales
            </a>
          </div>

          {/* Value Highlights Grid */}
          <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#27272a] max-w-lg">
            <div className="flex flex-col space-y-1">
              <span className="font-display text-2xl font-bold text-[#ffffff]">4 Canales</span>
              <span className="font-mono-custom text-[11px] text-[#cbd5e1] font-medium">
                Estrategia Multi-Nivel
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="font-display text-2xl font-bold text-[#FF8A00]">Discovery</span>
              <span className="font-mono-custom text-[11px] text-[#cbd5e1] font-medium">
                Validación Pre-Código
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="font-display text-2xl font-bold text-[#FBC02D]">Growth</span>
              <span className="font-mono-custom text-[11px] text-[#cbd5e1] font-medium">
                Socio a Resultados
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Interactive Nexus Showcase Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-[#121214] border border-[#3f3f46] rounded-2xl max-w-4xl w-full p-6 md:p-8 shadow-2xl relative space-y-6 overflow-hidden">
            {/* Modal Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[#cbd5e1] hover:text-white p-2 rounded-lg bg-[#18181b] border border-[#27272a]"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#D32F2F]/20 text-[#FF3D3D] flex items-center justify-center border border-[#D32F2F]/40 font-bold">
                <span className="material-symbols-outlined text-2xl">cyclone</span>
              </div>
              <div>
                <h3 className="font-display text-2xl font-black text-white">
                  Nexus Evolution Interactive Engine
                </h3>
                <span className="font-mono-custom text-xs text-[#FBC02D]">Arquitectura de Crecimiento Acelerado ESCALIA Studio</span>
              </div>
            </div>

            {/* Modal Interactive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="relative aspect-video rounded-xl overflow-hidden border border-[#27272a]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKvBAnwaNvs6v9kCNV95yMMtUYZcS7MgTPPwR3kLn_8szDA_eQkGIQCrmDIPqy8KuZ2sLtFxAwmeiE2eIUE6euzsA1Y2Cc0xocXo4IT8G9kE7cLYsrWyTmPOBi7i3fNSh-JZgGxxyivYtnShF190eKYnfR430jmDCc5C7FriQgiKPYxdwOGXqt5dH44fNed0RRDPb02prYh-YLZO-1BdkGKcjqEpxRlSzannGdhXE8MwaW_J89N92L7w"
                  alt="Nexus Evolution"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent flex items-end p-4">
                  <span className="font-mono-custom text-xs text-emerald-400 font-bold bg-[#09090b]/90 px-3 py-1 rounded border border-[#27272a]">
                    ✓ Ecosistema de Producción &amp; Monetización
                  </span>
                </div>
              </div>

              <div className="space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="p-3 bg-[#18181b] rounded-lg border border-[#27272a] space-y-1">
                    <div className="font-display text-sm font-bold text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-[#FF3D3D]">speed</span>
                      Velocidad de Salida a Mercado
                    </div>
                    <p className="font-body text-xs text-[#cbd5e1]">
                      Prototipado en 2 semanas y puesta en producción de MVP funcional en menos de 6 semanas.
                    </p>
                  </div>

                  <div className="p-3 bg-[#18181b] rounded-lg border border-[#27272a] space-y-1">
                    <div className="font-display text-sm font-bold text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-[#F57C00]">trending_up</span>
                      Atracción e Adquisición Pagada &amp; Orgánica
                    </div>
                    <p className="font-body text-xs text-[#cbd5e1]">
                      Funnel de conversión optimizado para capturar leads B2B y suscriptores con bajo CAC.
                    </p>
                  </div>

                  <div className="p-3 bg-[#18181b] rounded-lg border border-[#27272a] space-y-1">
                    <div className="font-display text-sm font-bold text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-[#FBC02D]">handshake</span>
                      Modelo Growth Partner (Revenue Share)
                    </div>
                    <p className="font-body text-xs text-[#cbd5e1]">
                      Alineación directa: coinvertimos talento y tecnología a cambio de participación en ventas.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 bg-[#18181b] border border-[#27272a] text-[#cbd5e1] font-mono-custom text-xs rounded-lg hover:bg-[#27272a]"
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      onOpenAppointment();
                    }}
                    className="px-6 py-2.5 fire-gradient text-white font-mono-custom text-xs font-bold uppercase tracking-wider rounded-lg hover:brightness-110 flex items-center gap-2 shadow-lg"
                  >
                    <span>Agendar Discovery Nexus</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};


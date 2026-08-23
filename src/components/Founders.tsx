import React from 'react';

interface Founder {
  name: string;
  role: string;
  photo: string;
  description: string;
}

const FOUNDERS: Founder[] = [
  {
    name: 'José Alfredo Silva Castillo',
    role: 'Founder & Visionary',
    photo: '/founders/jose-silva.jpg',
    description:
      'Físico con más de 25 años de experiencia, Desarrollador de Productos digitales especializados tipo SaaS (Software as a Service) y aplicaciones especializadas.',
  },
  {
    name: 'Leonardo José Silva',
    role: 'Founder & Visionary',
    photo: '/founders/leonardo-silva.jpg',
    description:
      'Estudiante de Ingeniería Informática en la Universidad Politécnica Territorial de Valencia (UPTV), Desarrollador de Productos digitales especializados tipo SaaS (Software as a Service) y aplicaciones especializadas.',
  },
];

export const Founders: React.FC = () => {
  return (
    <section className="py-24 px-5 md:px-20 bg-[#0e0e0e] border-y border-[#2A2A2A]" id="fundadores">
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="mb-16 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#18181b] border border-[#27272a] rounded-full">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D32F2F] animate-pulse"></span>
            <span className="font-mono-custom text-xs text-[#FBC02D] uppercase tracking-wider font-bold">
              Equipo Fundador
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-[#ffffff] tracking-tight">
            Fundadores
          </h2>

          <p className="font-body text-base md:text-xl text-[#cbd5e1] max-w-2xl mx-auto leading-relaxed">
            Las mentes detrás de ESCALIA Studio.
          </p>
        </div>

        {/* Founders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {FOUNDERS.map((founder) => (
            <div
              key={founder.name}
              className="bg-[#121214] p-8 rounded-xl border border-[#27272a] hover:border-[#D32F2F]/60 transition-colors flex flex-col items-center text-center space-y-4"
            >
              <div className="inline-flex h-72 max-w-full rounded-xl overflow-hidden border-2 border-[#FBC02D]/40">
                <img
                  src={founder.photo}
                  alt={founder.name}
                  className="h-full w-auto object-cover"
                />
              </div>
              <div className="space-y-1">
                <h3 className="font-display text-xl font-bold text-white">{founder.name}</h3>
                <span className="block font-mono-custom text-xs text-[#FBC02D] uppercase tracking-wider font-bold">
                  {founder.role}
                </span>
              </div>
              <p className="font-body text-sm text-[#cbd5e1] leading-relaxed">{founder.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

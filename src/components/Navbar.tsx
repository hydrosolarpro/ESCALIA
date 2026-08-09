import React, { useState, useEffect } from 'react';
import { EscaliaLogo } from './EscaliaLogo';

interface NavbarProps {
  onOpenAppointment: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAppointment }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('canales');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ['servicios', 'canales', 'portafolio', 'nosotros', 'contacto'];
      const scrollPos = window.scrollY + 100;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Servicios', href: '#servicios', id: 'servicios' },
    { name: 'Canales', href: '#canales', id: 'canales' },
    { name: 'Portafolio', href: '#portafolio', id: 'portafolio' },
    { name: 'Nosotros', href: '#contacto', id: 'nosotros' }
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#0A0A0A]/95 backdrop-blur-md shadow-2xl border-b border-[#27272a] py-3.5' : 'bg-[#0A0A0A]/85 backdrop-blur-md border-b border-[#27272a]/80 py-4.5'
    }`}>
      <div className="flex justify-between items-center px-6 sm:px-10 lg:px-16 max-w-[1400px] mx-auto">
        {/* Brand Logo with generous right margin */}
        <a href="#" className="flex items-center hover:opacity-90 transition-opacity cursor-pointer shrink-0 pr-6 lg:pr-12">
          <EscaliaLogo variant="dark" />
        </a>

        {/* Desktop Navigation Links with Spacious Breathing Room */}
        <div className="hidden md:flex items-center gap-8 lg:gap-12 xl:gap-14 mx-auto">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.name}
                href={link.href}
                className={`font-body text-base transition-all duration-200 relative py-1.5 px-1.5 ${
                  isActive
                    ? 'text-[#FF3D3D] font-bold border-b-2 border-[#FF3D3D]'
                    : 'text-[#cbd5e1] hover:text-[#FBC02D] font-medium'
                }`}
              >
                {link.name}
              </a>
            );
          })}
        </div>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-4 shrink-0 pl-6 lg:pl-12">
          <a
            href="https://calendly.com/productosaas2026/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 fire-gradient text-[#ffffff] font-mono-custom text-xs uppercase tracking-wider rounded-lg hover:brightness-110 transition-all duration-300 shadow-xl font-bold flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
          >
            <span>Agendar Cita</span>
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </a>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-[#ffffff] p-2 rounded-lg bg-[#18181b] border border-[#27272a] hover:bg-[#27272a] transition-colors"
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined text-xl">
            {mobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#121214] border-b border-[#27272a] px-6 py-6 space-y-5 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`font-body text-lg py-2.5 border-b border-[#18181b] ${
                  activeSection === link.id
                    ? 'text-[#FF3D3D] font-bold'
                    : 'text-[#cbd5e1]'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-2">
            <a
              href="https://calendly.com/productosaas2026/30min"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3.5 fire-gradient text-[#ffffff] font-mono-custom text-xs uppercase tracking-wider rounded-lg text-center font-bold flex items-center justify-center gap-2 shadow-lg"
            >
              <span className="material-symbols-outlined text-sm">calendar_month</span>
              <span>Agendar Cita en Calendly</span>
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { ValuePropCarousel } from '../components/ValuePropCarousel';
import { FourChannels } from '../components/FourChannels';
import { TransversalPortfolio } from '../components/TransversalPortfolio';
import { Founders } from '../components/Founders';
import { ContactFooter } from '../components/ContactFooter';
import { ChannelDetailModal } from '../components/ChannelDetailModal';
import { Toast } from '../components/Toast';
import { Channel } from '../types';

export const PublicSite: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleShowToast = (msg: string) => {
    setToastMessage(msg);
  };

  const handleOpenAppointment = () => {
    window.open('https://calendly.com/productosaas2026/30min', '_blank', 'noopener,noreferrer');
    handleShowToast('Abriendo Calendly en una pestaña nueva...');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#e5e2e1] font-body selection:bg-[#D32F2F] selection:text-white">
      {/* Navigation Bar */}
      <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded">Saltar al contenido</a>
      <Navbar
        onOpenAppointment={handleOpenAppointment}
      />

      {/* Main Content Sections */}
      <main id="contenido">
        {/* Hero Section */}
        <Hero
          onOpenAppointment={handleOpenAppointment}
        />

        {/* Visual Value Proposition Carousel at Beginning of Page */}
        <ValuePropCarousel
          onSelectChannel={(channel) => setSelectedChannel(channel)}
        />

        {/* Four Channels Section */}
        <FourChannels
          onSelectChannel={(channel) => setSelectedChannel(channel)}
          onOpenAppointment={handleOpenAppointment}
        />

        {/* Transversal Portfolio Bento Grid */}
        <TransversalPortfolio
          onOpenAppointment={handleOpenAppointment}
        />

        {/* Founders Section */}
        <Founders />
      </main>

      {/* Contact & Footer Section */}
      <ContactFooter
        onOpenAppointment={handleOpenAppointment}
        onShowToast={handleShowToast}
      />

      {/* Interactive Channel Detail Modal */}
      <ChannelDetailModal
        channel={selectedChannel}
        onClose={() => setSelectedChannel(null)}
        onOpenAppointment={() => {
          setSelectedChannel(null);
          handleOpenAppointment();
        }}
      />

      {/* Global Toast Notification */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
};

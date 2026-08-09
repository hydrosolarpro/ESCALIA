import React, { useState } from 'react';
import { CalculationResult } from '../types';

interface DiscoveryCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAppointment: () => void;
  onShowToast: (msg: string) => void;
}

export const DiscoveryCalculatorModal: React.FC<DiscoveryCalculatorModalProps> = ({
  isOpen,
  onClose,
  onOpenAppointment,
  onShowToast
}) => {
  const [stage, setStage] = useState<'idea' | 'prototype' | 'scaling'>('idea');
  const [model, setModel] = useState<'b2c' | 'pyme' | 'enterprise' | 'growth'>('pyme');
  const [features, setFeatures] = useState<string[]>([
    'Multi-tenant Architecture',
    'AI / Gemini Model Integration'
  ]);

  if (!isOpen) return null;

  const toggleFeature = (feat: string) => {
    if (features.includes(feat)) {
      setFeatures(features.filter((f) => f !== feat));
    } else {
      setFeatures([...features, feat]);
    }
  };

  const calculateResult = (): CalculationResult => {
    let weeks = 4;
    let channel = 'Canal 02: SaaS para PyMEs';
    let score = 75;
    const milestones: string[] = ['Semana 1-2: Product Discovery & Wireframes'];

    if (stage === 'idea') weeks += 2;
    if (stage === 'prototype') weeks += 1;
    if (stage === 'scaling') weeks += 4;

    if (model === 'b2c') {
      channel = 'Canal 01: Productos Propios';
      score = 80;
    } else if (model === 'pyme') {
      channel = 'Canal 02: SaaS para PyMEs';
      score = 85;
    } else if (model === 'enterprise') {
      channel = 'Canal 03: SaaS a Medida (Enterprise)';
      weeks += 4;
      score = 92;
    } else if (model === 'growth') {
      channel = 'Canal 04: Growth Partner SaaS';
      score = 98;
    }

    weeks += Math.round(features.length * 0.8);

    milestones.push(`Semana 3-${Math.max(3, Math.floor(weeks / 2))}: Core MVP Architecture & API`);
    milestones.push(`Semana ${Math.floor(weeks / 2) + 1}-${weeks - 1}: Integration & QA Testing`);
    milestones.push(`Semana ${weeks}: Deployment & Growth Kickoff`);

    return {
      estimatedTimeWeeks: weeks,
      recommendedChannel: channel,
      growthScore: score,
      keyMilestones: milestones
    };
  };

  const result = calculateResult();

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0A]/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#131313] border border-[#2A2A2A] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative space-y-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#e4beba] hover:text-white p-2 rounded hover:bg-[#201f1f]"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded bg-[#F57C00]/20 text-[#F57C00] flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-2xl">calculate</span>
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold text-[#e5e2e1]">
              Simulador &amp; Estimador SaaS
            </h3>
            <span className="font-mono-custom text-xs text-[#FBC02D]">Calculadora de Tiempos y Canal ESCALIA</span>
          </div>
        </div>

        {/* Configuration Step Options */}
        <div className="space-y-5 border-t border-b border-[#2A2A2A] py-4">
          {/* Stage */}
          <div>
            <label className="block font-mono-custom text-xs text-[#e4beba] uppercase mb-2 font-semibold">
              1. Etapa Actual del Proyecto
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'idea', label: 'Idea / Concepto' },
                { id: 'prototype', label: 'Prototipo Inicial' },
                { id: 'scaling', label: 'SaaS en Operación' }
              ].map((s) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => setStage(s.id as any)}
                  className={`py-2 px-3 rounded font-mono-custom text-xs transition-colors border ${
                    stage === s.id
                      ? 'bg-[#D32F2F] text-white border-[#D32F2F] font-bold'
                      : 'bg-[#1c1b1b] text-[#e4beba] border-[#2A2A2A] hover:border-[#D32F2F]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Model */}
          <div>
            <label className="block font-mono-custom text-xs text-[#e4beba] uppercase mb-2 font-semibold">
              2. Modelo de Negocio Target
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'b2c', label: 'B2C / Propios' },
                { id: 'pyme', label: 'PyME B2B' },
                { id: 'enterprise', label: 'Enterprise Custom' },
                { id: 'growth', label: 'Growth Partner' }
              ].map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setModel(m.id as any)}
                  className={`py-2 px-3 rounded font-mono-custom text-xs transition-colors border ${
                    model === m.id
                      ? 'bg-[#F57C00] text-white border-[#F57C00] font-bold'
                      : 'bg-[#1c1b1b] text-[#e4beba] border-[#2A2A2A] hover:border-[#F57C00]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Features Toggle */}
          <div>
            <label className="block font-mono-custom text-xs text-[#e4beba] uppercase mb-2 font-semibold">
              3. Módulos / Requerimientos Requeridos
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'Multi-tenant Architecture',
                'AI / Claude / n8n Integration',
                'Mobile App (iOS & Android)',
                'Automated Stripe/Payment Engine',
                'Enterprise Role Permissions (RBAC)',
                'Real-Time Analytics Dashboard'
              ].map((feat) => {
                const selected = features.includes(feat);
                return (
                  <button
                    type="button"
                    key={feat}
                    onClick={() => toggleFeature(feat)}
                    className={`py-2 px-3 rounded font-mono-custom text-xs text-left transition-colors border flex items-center justify-between ${
                      selected
                        ? 'bg-[#0A0A0A] text-[#FBC02D] border-[#FBC02D]'
                        : 'bg-[#1c1b1b] text-[#e4beba] border-[#2A2A2A] hover:border-[#5b403d]'
                    }`}
                  >
                    <span>{feat}</span>
                    <span>{selected ? '✓' : '+'}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Calculated Results Card */}
        <div className="bg-[#0A0A0A] p-5 rounded-lg border border-[#D32F2F]/40 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono-custom text-xs text-[#e4beba] uppercase">Canal Recomendado:</span>
              <div className="font-display text-lg font-bold text-[#FBC02D]">
                {result.recommendedChannel}
              </div>
            </div>

            <div className="text-right">
              <span className="font-mono-custom text-xs text-[#e4beba] uppercase">Tiempo Estimado:</span>
              <div className="font-display text-2xl font-black text-[#D32F2F]">
                ~{result.estimatedTimeWeeks} Semanas
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono-custom mb-1 text-[#e4beba]">
              <span>Índice de Viabilidad y Crecimiento:</span>
              <span className="text-emerald-400 font-bold">{result.growthScore}/100</span>
            </div>
            <div className="w-full h-2 bg-[#201f1f] rounded-full overflow-hidden">
              <div
                className="h-full fire-gradient transition-all duration-500"
                style={{ width: `${result.growthScore}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-1 pt-2">
            <span className="font-mono-custom text-[11px] text-[#e4beba] uppercase font-semibold">
              Hitos de Entrega Sugeridos:
            </span>
            {result.keyMilestones.map((m, idx) => (
              <div key={idx} className="font-mono-custom text-xs text-[#e5e2e1] flex items-center gap-2">
                <span className="text-[#D32F2F]">►</span>
                <span>{m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#201f1f] border border-[#2A2A2A] text-[#e4beba] font-mono-custom text-xs rounded hover:bg-[#2a2a2a]"
          >
            Cerrar
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenAppointment();
              onShowToast('Estimación cargada para la sesión de Discovery');
            }}
            className="px-6 py-2.5 fire-gradient text-white font-mono-custom text-xs font-bold uppercase tracking-wider rounded hover:opacity-90 flex items-center gap-2 shadow-lg"
          >
            <span>Agendar Cita con esta Configuración</span>
            <span className="material-symbols-outlined text-xs">calendar_month</span>
          </button>
        </div>
      </div>
    </div>
  );
};

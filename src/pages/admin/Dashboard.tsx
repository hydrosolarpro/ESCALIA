import React, { useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { useLeads } from '../../hooks/useLeads';
import { useRevenue } from '../../hooks/useRevenue';
import { useSettings } from '../../hooks/useSettings';
import { EscaliaLogo } from '../../components/EscaliaLogo';
import { OverviewTab } from '../../components/admin/OverviewTab';
import { LeadsTab } from '../../components/admin/LeadsTab';
import { RevenueTab } from '../../components/admin/RevenueTab';

type TabId = 'resumen' | 'leads' | 'ingresos';

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'resumen', label: 'Resumen', icon: 'dashboard' },
  { id: 'leads', label: 'Clientes Potenciales', icon: 'groups' },
  { id: 'ingresos', label: 'Ingresos', icon: 'payments' },
];

export const Dashboard: React.FC = () => {
  const { session, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('resumen');

  const { leads, loading: leadsLoading, addLead, updateLead, updateLeadStatus, deleteLead } = useLeads();
  const { entries, loading: revenueLoading, addRevenue, updateRevenue, deleteRevenue } = useRevenue();
  const { usdToPen, updateRate } = useSettings();

  const loading = leadsLoading || revenueLoading;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#e5e2e1]">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#27272a]">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-4 flex items-center justify-between gap-4">
          <a href="/" className="shrink-0">
            <EscaliaLogo variant="dark" />
          </a>
          <div className="hidden sm:block font-mono-custom text-[11px] text-[#71717a] truncate">
            {session?.user?.email}
          </div>
          <button
            onClick={signOut}
            className="shrink-0 px-4 py-2 bg-[#18181b] border border-[#27272a] hover:border-[#D32F2F] hover:text-white text-[#cbd5e1] text-xs font-mono-custom font-bold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>

        {/* Tabs */}
        <nav className="max-w-[1400px] mx-auto px-5 md:px-10 flex gap-1 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 flex items-center gap-2 px-4 py-3 text-xs font-mono-custom font-bold uppercase tracking-wider border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'text-[#FF3D3D] border-[#FF3D3D]'
                  : 'text-[#71717a] border-transparent hover:text-[#cbd5e1]'
              }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Content */}
      <main className="max-w-[1400px] mx-auto px-5 md:px-10 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <span className="font-mono-custom text-xs text-[#71717a] animate-pulse">Cargando datos…</span>
          </div>
        ) : (
          <>
            {activeTab === 'resumen' && (
              <OverviewTab leads={leads} revenue={entries} usdToPen={usdToPen} updateRate={updateRate} />
            )}
            {activeTab === 'leads' && (
              <LeadsTab
                leads={leads}
                addLead={addLead}
                updateLead={updateLead}
                updateLeadStatus={updateLeadStatus}
                deleteLead={deleteLead}
              />
            )}
            {activeTab === 'ingresos' && (
              <RevenueTab
                entries={entries}
                addRevenue={addRevenue}
                updateRevenue={updateRevenue}
                deleteRevenue={deleteRevenue}
                usdToPen={usdToPen}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

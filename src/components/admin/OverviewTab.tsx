import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Lead, RevenueEntry } from '../../types';
import { StatCard } from './StatCard';
import { exportToExcel, exportToPdf } from '../../lib/exportUtils';

interface OverviewTabProps {
  leads: Lead[];
  revenue: RevenueEntry[];
}

const CHART_COLORS = ['#D32F2F', '#F57C00', '#FBC02D', '#60a5fa', '#00E676', '#a78bfa'];

const currencyFmt = (n: number) =>
  n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const OverviewTab: React.FC<OverviewTabProps> = ({ leads, revenue }) => {
  // Los leads en estado "ganado" con monto definido cuentan como ganancia real,
  // igual que las filas cargadas manualmente en la tabla de Ingresos.
  const wonLeadsWithAmount = useMemo(
    () => leads.filter((l) => l.status === 'ganado' && l.amount != null),
    [leads]
  );

  const totalRevenue = useMemo(() => {
    const fromRevenue = revenue.reduce((sum, r) => sum + Number(r.amount), 0);
    const fromLeads = wonLeadsWithAmount.reduce((sum, l) => sum + Number(l.amount), 0);
    return fromRevenue + fromLeads;
  }, [revenue, wonLeadsWithAmount]);

  const revenueByChannel = useMemo(() => {
    const map = new Map<string, number>();
    revenue.forEach((r) => map.set(r.channel, (map.get(r.channel) || 0) + Number(r.amount)));
    wonLeadsWithAmount.forEach((l) => {
      const key = l.channel || 'Sin canal';
      map.set(key, (map.get(key) || 0) + Number(l.amount));
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [revenue, wonLeadsWithAmount]);

  const revenueByProduct = useMemo(() => {
    const map = new Map<string, number>();
    revenue.forEach((r) => map.set(r.product, (map.get(r.product) || 0) + Number(r.amount)));
    wonLeadsWithAmount.forEach((l) => {
      const key = l.product || 'Sin producto';
      map.set(key, (map.get(key) || 0) + Number(l.amount));
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [revenue, wonLeadsWithAmount]);

  const leadsByChannel = useMemo(() => {
    const map = new Map<string, number>();
    leads.forEach((l) => {
      const key = l.channel || 'Sin canal';
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [leads]);

  const wonLeads = leads.filter((l) => l.status === 'ganado').length;
  const conversionRate = leads.length ? ((wonLeads / leads.length) * 100).toFixed(1) : '0.0';

  const handleExportPdf = () => {
    exportToPdf(
      'Resumen General — Ganancias por Canal (Ingresos + Leads Ganados)',
      ['Canal', 'Total (USD)'],
      revenueByChannel.map((r) => [r.name, currencyFmt(r.value)]),
      'escalia-resumen-ingresos'
    );
  };

  const handleExportExcel = () => {
    exportToExcel(
      'Resumen',
      ['Canal', 'Total (USD)'],
      revenueByChannel.map((r) => [r.name, r.value]),
      'escalia-resumen-ingresos'
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="font-display text-xl font-bold text-white">Resumen General</h2>
        <div className="flex gap-2">
          <button
            onClick={handleExportPdf}
            className="px-4 py-2 bg-[#18181b] border border-[#27272a] hover:border-[#D32F2F] text-[#FBC02D] text-xs font-mono-custom font-bold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">picture_as_pdf</span> PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="px-4 py-2 bg-[#18181b] border border-[#27272a] hover:border-[#00E676] text-emerald-400 text-xs font-mono-custom font-bold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">grid_on</span> Excel
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Ganancias Totales" value={`$${currencyFmt(totalRevenue)}`} icon="payments" color="#00E676" />
        <StatCard label="Leads Totales" value={String(leads.length)} icon="groups" color="#60a5fa" />
        <StatCard label="Leads Ganados" value={String(wonLeads)} icon="verified" color="#FBC02D" />
        <StatCard label="Tasa de Conversión" value={`${conversionRate}%`} icon="trending_up" color="#FF3D3D" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#121214] border border-[#27272a] rounded-xl p-5 min-w-0">
          <h3 className="font-mono-custom text-xs text-[#cbd5e1] uppercase tracking-wider font-bold mb-4">
            Ganancias por Canal <span className="text-[#525252] normal-case font-normal">(Ingresos + Leads Ganados)</span>
          </h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByChannel} margin={{ left: 0, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 10 }} interval={0} angle={-15} textAnchor="end" height={50} />
                <YAxis tick={{ fill: '#a1a1aa', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(v: number) => [`$${currencyFmt(v)}`, 'Ganancias']}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {revenueByChannel.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#121214] border border-[#27272a] rounded-xl p-5 min-w-0">
          <h3 className="font-mono-custom text-xs text-[#cbd5e1] uppercase tracking-wider font-bold mb-4">
            Top Productos por Ganancia <span className="text-[#525252] normal-case font-normal">(Ingresos + Leads Ganados)</span>
          </h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByProduct} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis type="number" tick={{ fill: '#a1a1aa', fontSize: 10 }} />
                <YAxis dataKey="name" type="category" width={110} tick={{ fill: '#a1a1aa', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => [`$${currencyFmt(v)}`, 'Ganancias']}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="#F57C00" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#121214] border border-[#27272a] rounded-xl p-5 min-w-0 lg:col-span-2">
          <h3 className="font-mono-custom text-xs text-[#cbd5e1] uppercase tracking-wider font-bold mb-4">
            Distribución de Leads por Canal
          </h3>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leadsByChannel}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                >
                  {leadsByChannel.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11, color: '#cbd5e1' }} />
                <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

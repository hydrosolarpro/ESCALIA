import React, { useState } from 'react';
import { CHANNELS_DATA } from '../../data/channelsData';
import { RevenueEntry, RevenueInsert } from '../../types';
import { exportToExcel, exportToPdf } from '../../lib/exportUtils';

interface RevenueTabProps {
  entries: RevenueEntry[];
  addRevenue: (entry: RevenueInsert) => Promise<{ error: string | null }>;
  deleteRevenue: (id: string) => Promise<{ error: string | null }>;
}

const emptyForm: RevenueInsert = {
  channel: '',
  product: '',
  amount: 0,
  currency: 'USD',
  description: '',
  entry_date: new Date().toISOString().slice(0, 10),
};

const currencyFmt = (n: number) =>
  n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const RevenueTab: React.FC<RevenueTabProps> = ({ entries, addRevenue, deleteRevenue }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<RevenueInsert>(emptyForm);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await addRevenue(form);
    setSaving(false);
    if (!error) {
      setForm(emptyForm);
      setShowForm(false);
    }
  };

  const COLUMNS = ['Canal', 'Producto', 'Monto', 'Moneda', 'Descripción', 'Fecha'];
  const exportRows = () =>
    entries.map((e) => [
      e.channel,
      e.product,
      currencyFmt(Number(e.amount)),
      e.currency,
      e.description || '',
      new Date(e.entry_date).toLocaleDateString('es-PE'),
    ]);

  const total = entries.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="font-display text-xl font-bold text-white">Registro de Ganancias</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => exportToPdf('Registro de Ganancias', COLUMNS, exportRows(), 'escalia-ingresos')}
            className="px-4 py-2 bg-[#18181b] border border-[#27272a] hover:border-[#D32F2F] text-[#FBC02D] text-xs font-mono-custom font-bold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">picture_as_pdf</span> PDF
          </button>
          <button
            onClick={() => exportToExcel('Ingresos', COLUMNS, exportRows(), 'escalia-ingresos')}
            className="px-4 py-2 bg-[#18181b] border border-[#27272a] hover:border-[#00E676] text-emerald-400 text-xs font-mono-custom font-bold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">grid_on</span> Excel
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 fire-gradient text-white text-xs font-mono-custom font-bold rounded-lg flex items-center gap-1.5 shadow-lg hover:brightness-110 transition-all"
          >
            <span className="material-symbols-outlined text-sm">add_circle</span> Registrar Ingreso
          </button>
        </div>
      </div>

      <div className="bg-[#121214] border border-[#27272a] rounded-xl p-5 flex items-center justify-between">
        <span className="font-mono-custom text-xs text-[#a1a1aa] uppercase tracking-wider font-bold">
          Total Acumulado
        </span>
        <span className="font-display text-2xl font-black text-emerald-400">${currencyFmt(total)}</span>
      </div>

      <div className="bg-[#121214] border border-[#27272a] rounded-xl overflow-x-auto">
        <table className="w-full text-left min-w-[720px]">
          <thead>
            <tr className="border-b border-[#27272a] text-[11px] font-mono-custom text-[#a1a1aa] uppercase tracking-wider">
              <th className="px-4 py-3">Canal</th>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Monto</th>
              <th className="px-4 py-3">Descripción</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b border-[#1c1c20] hover:bg-[#18181b]/60 transition-colors">
                <td className="px-4 py-3 text-sm text-white whitespace-nowrap">{entry.channel}</td>
                <td className="px-4 py-3 text-xs text-[#cbd5e1] whitespace-nowrap">{entry.product}</td>
                <td className="px-4 py-3 text-sm font-bold text-emerald-400 whitespace-nowrap">
                  {entry.currency} {currencyFmt(Number(entry.amount))}
                </td>
                <td className="px-4 py-3 text-xs text-[#71717a] max-w-[240px] truncate">{entry.description}</td>
                <td className="px-4 py-3 text-xs text-[#71717a] whitespace-nowrap">
                  {new Date(entry.entry_date).toLocaleDateString('es-PE')}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => deleteRevenue(entry.id)}
                    className="text-[#71717a] hover:text-[#FF3D3D] transition-colors"
                    title="Eliminar"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-[#71717a]">
                  Aún no hay ingresos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-[#131313] border border-[#2A2A2A] rounded-xl p-6 md:p-8 max-w-lg w-full space-y-4 relative"
          >
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-[#e4beba] hover:text-white p-1"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="font-display text-xl font-bold text-white">Registrar Ganancia</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select
                required
                value={form.channel}
                onChange={(e) => setForm({ ...form, channel: e.target.value })}
                className="sm:col-span-2 bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#D32F2F]"
              >
                <option value="">Canal…</option>
                {CHANNELS_DATA.map((c) => (
                  <option key={c.id} value={c.title}>
                    {c.title}
                  </option>
                ))}
              </select>
              <input
                required
                placeholder="Producto"
                value={form.product}
                onChange={(e) => setForm({ ...form, product: e.target.value })}
                className="sm:col-span-2 bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#D32F2F]"
              />
              <input
                required
                type="number"
                min="0"
                step="0.01"
                placeholder="Monto"
                value={form.amount || ''}
                onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
                className="bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#D32F2F]"
              />
              <select
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                className="bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#D32F2F]"
              >
                <option value="USD">USD</option>
                <option value="PEN">PEN</option>
              </select>
              <input
                type="date"
                value={form.entry_date}
                onChange={(e) => setForm({ ...form, entry_date: e.target.value })}
                className="sm:col-span-2 bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#D32F2F]"
              />
              <textarea
                placeholder="Descripción (opcional)"
                value={form.description || ''}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="sm:col-span-2 bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#D32F2F] resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-[#2A2A2A] text-[#e4beba] font-mono-custom text-xs rounded hover:bg-[#1c1b1b]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 fire-gradient text-white font-mono-custom text-xs uppercase font-bold rounded hover:opacity-90 disabled:opacity-60"
              >
                {saving ? 'Guardando…' : 'Guardar Ingreso'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

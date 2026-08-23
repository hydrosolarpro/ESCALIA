import React, { useMemo, useState } from 'react';
import { CHANNELS_DATA } from '../../data/channelsData';
import { Lead, LeadInsert, LeadStatus } from '../../types';
import { exportToExcel, exportToPdf } from '../../lib/exportUtils';

interface LeadsTabProps {
  leads: Lead[];
  addLead: (lead: LeadInsert) => Promise<{ error: string | null }>;
  updateLead: (id: string, updates: LeadInsert) => Promise<{ error: string | null }>;
  updateLeadStatus: (id: string, status: LeadStatus) => Promise<{ error: string | null }>;
  deleteLead: (id: string) => Promise<{ error: string | null }>;
}

const STATUS_LABELS: Record<LeadStatus, string> = {
  nuevo: 'Nuevo',
  contactado: 'Contactado',
  en_negociacion: 'En Negociación',
  stand_by: 'Stand By',
  ganado: 'Ganado',
  perdido: 'Perdido',
};

const STATUS_COLORS: Record<LeadStatus, string> = {
  nuevo: '#60a5fa',
  contactado: '#FBC02D',
  en_negociacion: '#F57C00',
  stand_by: '#94a3b8',
  ganado: '#00E676',
  perdido: '#71717a',
};

const SOURCE_LABELS: Record<string, string> = {
  web_form: 'Formulario Web',
  calendly: 'Calendly',
  manual: 'Registro Manual',
  whatsapp_interes: 'Interés WhatsApp',
};

const emptyForm: LeadInsert = {
  full_name: '',
  email: '',
  phone: '',
  country: '',
  channel: '',
  product: '',
  amount: null,
  currency: 'USD',
  source: 'manual',
  status: 'nuevo',
  notes: '',
};

const currencyFmt = (n: number) =>
  n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const LeadsTab: React.FC<LeadsTabProps> = ({ leads, addLead, updateLead, updateLeadStatus, deleteLead }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<LeadInsert>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [channelFilter, setChannelFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = useMemo(
    () =>
      leads.filter(
        (l) => (!channelFilter || l.channel === channelFilter) && (!statusFilter || l.status === statusFilter)
      ),
    [leads, channelFilter, statusFilter]
  );

  const openNewForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (lead: Lead) => {
    setForm({
      full_name: lead.full_name,
      email: lead.email,
      phone: lead.phone,
      country: lead.country,
      channel: lead.channel,
      product: lead.product,
      amount: lead.amount,
      currency: lead.currency,
      source: lead.source,
      status: lead.status,
      notes: lead.notes,
    });
    setEditingId(lead.id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = editingId ? await updateLead(editingId, form) : await addLead(form);
    setSaving(false);
    if (!error) {
      closeForm();
    }
  };

  const exportRows = () =>
    filtered.map((l) => [
      l.full_name,
      l.email || '',
      l.phone || '',
      l.country || '',
      l.channel || '',
      l.product || '',
      l.amount != null ? `${l.currency} ${currencyFmt(Number(l.amount))}` : '',
      SOURCE_LABELS[l.source] || l.source,
      STATUS_LABELS[l.status],
      new Date(l.created_at).toLocaleDateString('es-PE'),
    ]);

  const COLUMNS = ['Nombre', 'Correo', 'Teléfono', 'País', 'Canal', 'Producto', 'Monto', 'Origen', 'Estado', 'Fecha'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="font-display text-xl font-bold text-white">Clientes Potenciales (Mini-CRM)</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => exportToPdf('Base de Clientes Potenciales', COLUMNS, exportRows(), 'escalia-leads')}
            className="px-4 py-2 bg-[#18181b] border border-[#27272a] hover:border-[#D32F2F] text-[#FBC02D] text-xs font-mono-custom font-bold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">picture_as_pdf</span> PDF
          </button>
          <button
            onClick={() => exportToExcel('Leads', COLUMNS, exportRows(), 'escalia-leads')}
            className="px-4 py-2 bg-[#18181b] border border-[#27272a] hover:border-[#00E676] text-emerald-400 text-xs font-mono-custom font-bold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">grid_on</span> Excel
          </button>
          <button
            onClick={openNewForm}
            className="px-4 py-2 fire-gradient text-white text-xs font-mono-custom font-bold rounded-lg flex items-center gap-1.5 shadow-lg hover:brightness-110 transition-all"
          >
            <span className="material-symbols-outlined text-sm">person_add</span> Nuevo Lead
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={channelFilter}
          onChange={(e) => setChannelFilter(e.target.value)}
          className="bg-[#121214] border border-[#27272a] text-xs text-[#cbd5e1] rounded-lg px-3 py-2 font-mono-custom outline-none focus:border-[#D32F2F]"
        >
          <option value="">Todos los canales</option>
          {CHANNELS_DATA.map((c) => (
            <option key={c.id} value={c.title}>
              {c.title}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#121214] border border-[#27272a] text-xs text-[#cbd5e1] rounded-lg px-3 py-2 font-mono-custom outline-none focus:border-[#D32F2F]"
        >
          <option value="">Todos los estados</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <span className="self-center font-mono-custom text-[11px] text-[#71717a]">
          {filtered.length} de {leads.length} registros
        </span>
      </div>

      {/* Table */}
      <div className="bg-[#121214] border border-[#27272a] rounded-xl overflow-x-auto">
        <table className="w-full text-left min-w-[1020px]">
          <thead>
            <tr className="border-b border-[#27272a] text-[11px] font-mono-custom text-[#a1a1aa] uppercase tracking-wider">
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Contacto</th>
              <th className="px-4 py-3">País</th>
              <th className="px-4 py-3">Canal / Producto</th>
              <th className="px-4 py-3">Monto</th>
              <th className="px-4 py-3">Origen</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => (
              <tr key={lead.id} className="border-b border-[#1c1c20] hover:bg-[#18181b]/60 transition-colors">
                <td className="px-4 py-3 text-sm text-white font-medium whitespace-nowrap">{lead.full_name}</td>
                <td className="px-4 py-3 text-xs text-[#cbd5e1]">
                  <div>{lead.email || '—'}</div>
                  <div className="text-[#71717a]">{lead.phone || '—'}</div>
                </td>
                <td className="px-4 py-3 text-xs text-[#cbd5e1] whitespace-nowrap">{lead.country || '—'}</td>
                <td className="px-4 py-3 text-xs text-[#cbd5e1] whitespace-nowrap">
                  <div>{lead.channel || '—'}</div>
                  <div className="text-[#71717a]">{lead.product || '—'}</div>
                </td>
                <td className="px-4 py-3 text-sm font-bold whitespace-nowrap">
                  {lead.amount != null ? (
                    <span className={lead.status === 'ganado' ? 'text-emerald-400' : 'text-[#cbd5e1]'}>
                      {lead.currency} {currencyFmt(Number(lead.amount))}
                    </span>
                  ) : (
                    <span className="text-[#525252]">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-[#cbd5e1] whitespace-nowrap">
                  {SOURCE_LABELS[lead.source] || lead.source}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={lead.status}
                    onChange={async (e) => {
                      const { error: statusError } = await updateLeadStatus(lead.id, e.target.value as LeadStatus);
                      if (statusError) {
                        alert(`No se pudo actualizar el estado: ${statusError}`);
                      }
                    }}
                    style={{ color: STATUS_COLORS[lead.status] }}
                    className="bg-[#09090b] border border-[#27272a] rounded-md px-2 py-1 text-[11px] font-mono-custom font-bold outline-none"
                  >
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value} style={{ color: '#e5e2e1' }}>
                        {label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-xs text-[#71717a] whitespace-nowrap">
                  {new Date(lead.created_at).toLocaleDateString('es-PE')}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditForm(lead)}
                      className="text-[#71717a] hover:text-[#FBC02D] transition-colors"
                      title="Editar"
                    >
                      <span className="material-symbols-outlined text-base">edit</span>
                    </button>
                    <button
                      onClick={() => deleteLead(lead.id)}
                      className="text-[#71717a] hover:text-[#FF3D3D] transition-colors"
                      title="Eliminar"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-sm text-[#71717a]">
                  No hay leads que coincidan con los filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Lead Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-[#131313] border border-[#2A2A2A] rounded-xl p-6 md:p-8 max-w-lg w-full space-y-4 relative max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={closeForm}
              className="absolute top-4 right-4 text-[#e4beba] hover:text-white p-1"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="font-display text-xl font-bold text-white">
              {editingId ? 'Editar Lead' : 'Registrar Lead Manualmente'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                required
                placeholder="Nombre completo"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className="sm:col-span-2 bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#D32F2F]"
              />
              <input
                type="email"
                placeholder="Correo"
                value={form.email || ''}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#D32F2F]"
              />
              <input
                placeholder="Teléfono"
                value={form.phone || ''}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#D32F2F]"
              />
              <input
                placeholder="País"
                value={form.country || ''}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#D32F2F]"
              />
              <select
                value={form.channel || ''}
                onChange={(e) => setForm({ ...form, channel: e.target.value })}
                className="bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#D32F2F]"
              >
                <option value="">Canal…</option>
                {CHANNELS_DATA.map((c) => (
                  <option key={c.id} value={c.title}>
                    {c.title}
                  </option>
                ))}
              </select>
              <input
                placeholder="Producto de interés"
                maxLength={200}
                value={form.product || ''}
                onChange={(e) => setForm({ ...form, product: e.target.value })}
                className="sm:col-span-2 bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#D32F2F]"
              />
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Monto del producto (opcional)"
                value={form.amount ?? ''}
                onChange={(e) => setForm({ ...form, amount: e.target.value === '' ? null : parseFloat(e.target.value) })}
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
              <select
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value as Lead['source'] })}
                className="bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#D32F2F]"
              >
                {Object.entries(SOURCE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as LeadStatus })}
                className="bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#D32F2F]"
              >
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <textarea
                placeholder="Notas"
                value={form.notes || ''}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className="sm:col-span-2 bg-[#09090b] border border-[#27272a] rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#D32F2F] resize-none"
              />
            </div>

            <p className="font-mono-custom text-[11px] text-[#71717a] leading-relaxed">
              El monto se suma a "Ganancias Totales" y a las gráficas del Resumen únicamente cuando el estado del lead es <span className="text-emerald-400 font-bold">Ganado</span>.
            </p>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeForm}
                className="px-4 py-2 border border-[#2A2A2A] text-[#e4beba] font-mono-custom text-xs rounded hover:bg-[#1c1b1b]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 fire-gradient text-white font-mono-custom text-xs uppercase font-bold rounded hover:opacity-90 disabled:opacity-60"
              >
                {saving ? 'Guardando…' : editingId ? 'Guardar Cambios' : 'Guardar Lead'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

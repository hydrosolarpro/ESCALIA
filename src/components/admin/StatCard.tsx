import React from 'react';

interface StatCardProps {
  label: string;
  value: string;
  icon: string;
  color?: string;
  sub?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color = '#FF3D3D', sub }) => (
  <div className="bg-[#121214] border border-[#27272a] rounded-xl p-5 flex items-start justify-between gap-3">
    <div className="space-y-1 min-w-0">
      <div className="font-mono-custom text-[11px] text-[#a1a1aa] uppercase tracking-wider font-bold truncate">
        {label}
      </div>
      <div className="font-display text-2xl sm:text-3xl font-black text-white truncate">{value}</div>
      {sub && <div className="font-mono-custom text-[11px] text-[#71717a]">{sub}</div>}
    </div>
    <div
      className="w-11 h-11 shrink-0 rounded-lg flex items-center justify-center"
      style={{ backgroundColor: `${color}22`, color }}
    >
      <span className="material-symbols-outlined text-xl">{icon}</span>
    </div>
  </div>
);

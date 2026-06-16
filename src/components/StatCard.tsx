import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: number;
  color?: 'gold' | 'emerald' | 'crimson';
  suffix?: string;
}

export default function StatCard({ title, value, icon, trend, color = 'gold', suffix }: StatCardProps) {
  const colorClasses = {
    gold: 'text-gold',
    emerald: 'text-emerald',
    crimson: 'text-crimson',
  };

  const bgClasses = {
    gold: 'bg-gold/10',
    emerald: 'bg-emerald/10',
    crimson: 'bg-crimson/10',
  };

  return (
    <div className="glass-card glass-card-hover p-6 animate-fade-in-up opacity-0">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${bgClasses[color]} flex items-center justify-center`}>
          <span className={colorClasses[color]}>{icon}</span>
        </div>
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              trend >= 0 ? 'text-emerald' : 'text-crimson'
            }`}
          >
            <span>{trend >= 0 ? '↑' : '↓'}</span>
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <p className="text-slate-400 text-sm mb-2">{title}</p>
      <div className="flex items-baseline gap-1">
        <h3 className={`text-3xl font-bold font-display ${colorClasses[color]}`}>{value}</h3>
        {suffix && <span className="text-slate-400 text-sm">{suffix}</span>}
      </div>
    </div>
  );
}

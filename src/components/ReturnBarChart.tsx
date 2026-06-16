import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useAssetStore } from '@/store/useAssetStore';
import type { PlanType } from '@/types';

export default function ReturnBarChart() {
  const { plans, activePlan, setActivePlan } = useAssetStore();
  const planTypes: PlanType[] = ['conservative', 'stable', 'aggressive'];

  const data = planTypes.map((planType) => {
    const plan = plans[planType];
    return {
      name: plan.name,
      type: planType,
      annualReturn: plan.expectedAnnualReturn,
      monthlyReturn: plan.expectedMonthlyReturn,
    };
  });

  const colors: Record<PlanType, string> = {
    conservative: '#10B981',
    stable: '#D4AF37',
    aggressive: '#EF4444',
  };

  return (
    <div className="glass-card p-6 animate-fade-in-up opacity-0 animate-stagger-3">
      <h3 className="text-xl font-display font-semibold text-white mb-6">年度收益对比</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorConservative" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="colorStable" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="colorAggressive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EF4444" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#EF4444" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="name"
              stroke="#94A3B8"
              tick={{ fill: '#94A3B8', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <YAxis
              stroke="#94A3B8"
              tick={{ fill: '#94A3B8', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickFormatter={(value) => {
                if (value >= 10000) {
                  return `${(value / 10000).toFixed(0)}万`;
                }
                return value;
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1E293B',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '8px',
                color: '#F8FAFC',
              }}
              formatter={(value: number, name: string) => {
                if (name === 'annualReturn') {
                  return [value.toLocaleString('zh-CN', { maximumFractionDigits: 0 }) + ' 元', '年度收益'];
                }
                return [value.toLocaleString('zh-CN', { maximumFractionDigits: 0 }) + ' 元', '月度收益'];
              }}
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            />
            <Bar
              dataKey="annualReturn"
              radius={[8, 8, 0, 0]}
              onClick={(data) => setActivePlan(data.type as PlanType)}
              cursor="pointer"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#color${entry.type.charAt(0).toUpperCase() + entry.type.slice(1)})`}
                  stroke={colors[entry.type]}
                  strokeWidth={entry.type === activePlan ? 2 : 0}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        {planTypes.map((planType) => {
          const plan = plans[planType];
          return (
            <div key={planType} className="p-3 rounded-lg bg-white/5">
              <p className="text-sm text-slate-400 mb-1">{plan.name}月收益</p>
              <p className="text-gold font-display font-bold text-lg">
                {plan.expectedMonthlyReturn.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}
                <span className="text-slate-400 text-sm font-sans font-normal ml-1">元</span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

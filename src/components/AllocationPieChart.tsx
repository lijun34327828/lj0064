import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { useAssetStore } from '@/store/useAssetStore';
import type { AssetCategory, PlanType } from '@/types';

const COLORS: Record<AssetCategory, string> = {
  real_estate: '#D4AF37',
  fund: '#10B981',
  private_enterprise: '#6366F1',
  collection: '#F59E0B',
};

const categoryNames: Record<AssetCategory, string> = {
  real_estate: '地产',
  fund: '基金',
  private_enterprise: '私人企业',
  collection: '藏品',
};

interface PieDataItem {
  name: string;
  value: number;
  category: AssetCategory;
}

function SinglePieChart({ planType }: { planType: PlanType }) {
  const { plans } = useAssetStore();
  const plan = plans[planType];

  const data: PieDataItem[] = (Object.keys(plan.allocations) as AssetCategory[])
    .map((cat) => ({
      name: categoryNames[cat],
      value: plan.allocations[cat],
      category: cat,
    }))
    .filter((item) => item.value > 0);

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
  }) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#0F172A"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight={600}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <h4 className="text-sm font-semibold text-slate-300 mb-2">{plan.name}</h4>
      <div className="w-full h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={renderCustomLabel}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.category]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1E293B',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '8px',
                color: '#F8FAFC',
              }}
              formatter={(value: number) => [`${value}%`, '占比']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <p className="text-gold font-display font-bold text-lg">
        {plan.expectedAnnualReturn.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}
        <span className="text-slate-400 text-sm font-sans font-normal ml-1">元/年</span>
      </p>
    </div>
  );
}

export default function AllocationPieChart() {
  const planTypes: PlanType[] = ['conservative', 'stable', 'aggressive'];

  return (
    <div className="glass-card p-6 animate-fade-in-up opacity-0 animate-stagger-2">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-display font-semibold text-white">资产分配方案</h3>
        <div className="flex gap-4">
          {(Object.keys(COLORS) as AssetCategory[]).map((cat) => (
            <div key={cat} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[cat] }}
              />
              <span className="text-xs text-slate-400">{categoryNames[cat]}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {planTypes.map((planType) => (
          <SinglePieChart key={planType} planType={planType} />
        ))}
      </div>
    </div>
  );
}

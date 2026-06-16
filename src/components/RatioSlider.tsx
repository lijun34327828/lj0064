import { useAssetStore } from '@/store/useAssetStore';
import type { AssetCategory } from '@/types';
import { Building2, TrendingUp, Briefcase, Gem } from 'lucide-react';

const categoryConfig: Record<
  AssetCategory,
  { name: string; icon: React.ReactNode; color: string }
> = {
  real_estate: {
    name: '地产',
    icon: <Building2 size={18} />,
    color: '#D4AF37',
  },
  fund: {
    name: '基金',
    icon: <TrendingUp size={18} />,
    color: '#10B981',
  },
  private_enterprise: {
    name: '私人企业',
    icon: <Briefcase size={18} />,
    color: '#6366F1',
  },
  collection: {
    name: '藏品',
    icon: <Gem size={18} />,
    color: '#F59E0B',
  },
};

export default function RatioSlider() {
  const { customAllocations, updateCustomAllocation, activePlan, plans } = useAssetStore();
  const categories = Object.keys(customAllocations) as AssetCategory[];
  const currentPlan = plans[activePlan];

  const total = categories.reduce((sum, cat) => sum + customAllocations[cat], 0);

  const handleReset = () => {
    categories.forEach((cat) => {
      updateCustomAllocation(cat, currentPlan.allocations[cat]);
    });
  };

  return (
    <div className="glass-card p-6 animate-fade-in-up opacity-0 animate-stagger-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-display font-semibold text-white">自定义资产比例</h3>
          <p className="text-sm text-slate-400 mt-1">拖动滑块调整各类资产分配比例</p>
        </div>
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-lg border border-gold/30 text-gold text-sm hover:bg-gold/10 transition-colors"
        >
          重置为当前方案
        </button>
      </div>

      <div className="space-y-5">
        {categories.map((cat) => {
          const config = categoryConfig[cat];
          const value = customAllocations[cat];

          return (
            <div key={cat} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${config.color}20`, color: config.color }}
                  >
                    {config.icon}
                  </div>
                  <span className="text-slate-200 font-medium">{config.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-400">
                    方案: {currentPlan.allocations[cat]}%
                  </span>
                  <span
                    className="text-lg font-display font-bold min-w-[3rem] text-right"
                    style={{ color: config.color }}
                  >
                    {value}%
                  </span>
                </div>
              </div>
              <div className="relative">
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-200"
                    style={{
                      width: `${value}%`,
                      background: `linear-gradient(90deg, ${config.color}99, ${config.color})`,
                    }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={value}
                  onChange={(e) => updateCustomAllocation(cat, Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">分配比例总计</span>
          <span
            className={`text-2xl font-display font-bold ${
              total === 100 ? 'text-emerald' : total > 100 ? 'text-crimson' : 'text-gold'
            }`}
          >
            {total}%
          </span>
        </div>
        {total !== 100 && (
          <p className="text-sm text-crimson mt-2">
            {total > 100 ? `超出 ${total - 100}%，请减少部分资产比例` : `剩余 ${100 - total}% 未分配`}
          </p>
        )}
      </div>
    </div>
  );
}

import { useAssetStore } from '@/store/useAssetStore';
import type { PlanType } from '@/types';
import { Shield, Scale, Zap } from 'lucide-react';

const planIcons: Record<PlanType, React.ReactNode> = {
  conservative: <Shield size={20} />,
  stable: <Scale size={20} />,
  aggressive: <Zap size={20} />,
};

const planInfo: Record<PlanType, { name: string; desc: string }> = {
  conservative: { name: '保守型', desc: '低风险 · 稳健收益' },
  stable: { name: '稳健型', desc: '平衡风险 · 稳定增长' },
  aggressive: { name: '扩张型', desc: '高风险 · 高收益' },
};

export default function PlanTabs() {
  const { activePlan, setActivePlan, plans } = useAssetStore();
  const planTypes: PlanType[] = ['conservative', 'stable', 'aggressive'];

  return (
    <div className="glass-card p-2 animate-fade-in-up opacity-0 animate-stagger-1">
      <div className="grid grid-cols-3 gap-2">
        {planTypes.map((planType) => {
          const isActive = activePlan === planType;
          const plan = plans[planType];
          return (
            <button
              key={planType}
              onClick={() => setActivePlan(planType)}
              className={`relative p-4 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-gold/15 border border-gold/50'
                  : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-gold rounded-t" />
              )}
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isActive ? 'bg-gold text-navy' : 'bg-white/5 text-slate-400'
                  }`}
                >
                  {planIcons[planType]}
                </div>
                <span
                  className={`font-semibold ${
                    isActive ? 'text-gold' : 'text-slate-300'
                  }`}
                >
                  {planInfo[planType].name}
                </span>
                <span className="text-xs text-slate-400">{planInfo[planType].desc}</span>
                <div className="mt-1">
                  <span
                    className={`text-sm font-display font-bold ${
                      isActive ? 'text-gold' : 'text-slate-300'
                    }`}
                  >
                    年化 {plan.expectedAnnualReturn.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}
                  </span>
                  <span className="text-xs text-slate-500"> 元</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

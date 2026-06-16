import { useEffect } from 'react';
import { Gem, TrendingUp } from 'lucide-react';
import AssetSelector from '@/components/AssetSelector';
import AssetConfigPanel from '@/components/AssetConfigPanel';
import IncomeOverviewCard from '@/components/IncomeOverviewCard';
import PlanTabs from '@/components/PlanTabs';
import AllocationPieChart from '@/components/AllocationPieChart';
import ReturnBarChart from '@/components/ReturnBarChart';
import RatioSlider from '@/components/RatioSlider';
import { useAssetStore } from '@/store/useAssetStore';

export default function Calculator() {
  const { calculateIncome, calculatePlans, getTotalInvestment, getSelectedAssets } = useAssetStore();

  useEffect(() => {
    calculateIncome();
    calculatePlans();
  }, [calculateIncome, calculatePlans]);

  const totalInvestment = getTotalInvestment();
  const selectedAssets = getSelectedAssets();

  return (
    <div className="min-h-screen py-8 px-4 md:px-8 custom-scrollbar">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12 animate-fade-in-up opacity-0">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold">
              <Gem size={28} className="text-navy" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold">
              <span className="gold-gradient-text">资产收支测算</span>
            </h1>
          </div>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            智能配置您的多元资产，科学优化资产配置方案，实现财富稳健增长
          </p>
          <div className="divider-gold mt-8 max-w-md mx-auto" />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <AssetSelector />
          <div>
            {selectedAssets.length > 0 ? (
              <div className="glass-card p-6 animate-fade-in-up opacity-0 animate-stagger-2 h-full flex flex-col justify-center">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                      <TrendingUp size={24} className="text-gold" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">可投资总资产</p>
                      <p className="text-3xl font-display font-bold gold-gradient-text">
                        {totalInvestment.toLocaleString('zh-CN')}
                        <span className="text-lg text-slate-400 font-sans font-normal ml-1">万元</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-sm">已选资产类目</p>
                    <p className="text-2xl font-display font-bold text-gold">{selectedAssets.length}</p>
                  </div>
                </div>
                <div className="divider-gold my-4" />
                <div className="flex flex-wrap gap-2">
                  {selectedAssets.map((asset) => (
                    <span
                      key={asset.category}
                      className="px-3 py-1 rounded-full bg-gold/10 text-gold text-sm border border-gold/20"
                    >
                      {asset.name} · {asset.value}万
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="glass-card p-6 animate-fade-in-up opacity-0 animate-stagger-2 h-full flex items-center justify-center text-center">
                <div>
                  <div className="w-16 h-16 rounded-full bg-white/5 mx-auto mb-4 flex items-center justify-center">
                    <TrendingUp size={32} className="text-slate-500" />
                  </div>
                  <p className="text-slate-400">请选择资产类目开始测算</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <IncomeOverviewCard />
        </div>

        <div className="mb-6">
          <PlanTabs />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <AllocationPieChart />
          <ReturnBarChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <AssetConfigPanel />
          <RatioSlider />
        </div>

        <footer className="text-center py-8 text-slate-500 text-sm">
          <div className="divider-gold mb-6 max-w-xs mx-auto" />
          <p>资产收支 AI 测算系统 · 仅供参考，不构成投资建议</p>
        </footer>
      </div>
    </div>
  );
}

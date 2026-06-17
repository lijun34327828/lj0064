import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import StatCard from './StatCard';
import { useAssetStore } from '@/store/useAssetStore';

function formatNumber(num: number): string {
  if (typeof num !== 'number' || isNaN(num) || !isFinite(num)) {
    return '0';
  }
  return num.toLocaleString('zh-CN');
}

export default function IncomeOverviewCard() {
  const incomeResult = useAssetStore((state) => state.incomeResult);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="animate-stagger-3">
        <StatCard
          title="月固定收入"
          value={formatNumber(incomeResult.monthlyFixedIncome)}
          icon={<TrendingUp size={24} />}
          color="emerald"
          suffix="元"
        />
      </div>
      <div className="animate-stagger-4">
        <StatCard
          title="月固定支出"
          value={formatNumber(incomeResult.monthlyFixedExpense)}
          icon={<TrendingDown size={24} />}
          color="crimson"
          suffix="元"
        />
      </div>
      <div className="animate-stagger-5">
        <StatCard
          title={incomeResult.isSurplus ? '月现金流（盈余）' : '月现金流（缺口）'}
          value={formatNumber(Math.abs(incomeResult.monthlyCashFlow))}
          icon={<Wallet size={24} />}
          color={incomeResult.isSurplus ? 'emerald' : 'crimson'}
          suffix="元"
        />
      </div>
    </div>
  );
}

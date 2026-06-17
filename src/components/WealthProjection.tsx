import { useState, useEffect, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp, PiggyBank, Clock, Target } from 'lucide-react';
import { useAssetStore } from '@/store/useAssetStore';
import { calculateProjection } from '@/utils/api';
import type { PlanType, ProjectionResult, ProjectionYearData } from '@/types';
import StatCard from './StatCard';

export default function WealthProjection() {
  const { assets, activePlan } = useAssetStore();
  const [years, setYears] = useState(10);
  const [projectionData, setProjectionData] = useState<ProjectionResult | null>(null);

  const selectedAssetsCount = assets.filter((a) => a.selected).length;

  useEffect(() => {
    if (selectedAssetsCount === 0) {
      setProjectionData(null);
      return;
    }

    let cancelled = false;

    const fetchData = async () => {
      const result = await calculateProjection(assets, years);
      if (!cancelled) {
        setProjectionData(result);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [assets, years, selectedAssetsCount]);

  const planNames: Record<PlanType, string> = {
    conservative: '保守型',
    stable: '稳健型',
    aggressive: '扩张型',
  };

  const chartData = useMemo(() => {
    if (!projectionData) return [];
    return projectionData.years.map((item: ProjectionYearData) => ({
      ...item,
      year: `第${item.year}年`,
    }));
  }, [projectionData]);

  const formatCurrency = (value: number): string => {
    if (value >= 100000000) {
      return `${(value / 100000000).toFixed(2)}亿`;
    }
    if (value >= 10000) {
      return `${(value / 10000).toFixed(0)}万`;
    }
    return value.toLocaleString('zh-CN', { maximumFractionDigits: 0 });
  };

  const formatFullCurrency = (value: number): string => {
    return value.toLocaleString('zh-CN', { maximumFractionDigits: 0 });
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYears(Number(e.target.value));
  };

  if (selectedAssetsCount === 0) {
    return (
      <div className="glass-card p-6 animate-fade-in-up opacity-0">
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-white/5 mx-auto mb-4 flex items-center justify-center">
            <TrendingUp size={32} className="text-slate-500" />
          </div>
          <p className="text-slate-400">请选择资产类目以查看财富增长预测</p>
        </div>
      </div>
    );
  }

  const finalAssets = projectionData?.finalAssets[activePlan] || 0;
  const totalProfit = projectionData?.totalProfit[activePlan] || 0;
  const doubleYear = projectionData?.doubleYears[activePlan];

  return (
    <div className="glass-card p-6 animate-fade-in-up opacity-0 animate-stagger-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-display font-semibold text-white">未来财富预测</h3>
          <p className="text-sm text-slate-400 mt-1">基于复利模型，展示不同方案下的长期资产增长趋势</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold/10 border border-gold/20">
          <Target size={18} className="text-gold" />
          <span className="text-gold font-medium">{planNames[activePlan]}</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-slate-400 text-sm">预测年限</span>
          <span className="text-2xl font-display font-bold gold-gradient-text">{years} 年</span>
        </div>
        <div className="relative">
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-gold transition-all duration-150"
              style={{ width: `${((years - 1) / 29) * 100}%` }}
            />
          </div>
          <input
            type="range"
            min="1"
            max="30"
            value={years}
            onChange={handleSliderChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-500">
          <span>1年</span>
          <span>30年</span>
        </div>
      </div>

      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorConservativeLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#10B981" stopOpacity={1} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={1} />
              </linearGradient>
              <linearGradient id="colorStableLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity={1} />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity={1} />
              </linearGradient>
              <linearGradient id="colorAggressiveLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#EF4444" stopOpacity={1} />
                <stop offset="100%" stopColor="#EF4444" stopOpacity={1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="year"
              stroke="#94A3B8"
              tick={{ fill: '#94A3B8', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <YAxis
              stroke="#94A3B8"
              tick={{ fill: '#94A3B8', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1E293B',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '8px',
                color: '#F8FAFC',
              }}
              formatter={(value: number, name: string) => {
                const planName = planNames[name as PlanType] || name;
                return [formatFullCurrency(value) + ' 元', planName];
              }}
            />
            <Legend
              formatter={(value: string) => {
                return <span style={{ color: '#94A3B8' }}>{planNames[value as PlanType] || value}</span>;
              }}
              wrapperStyle={{ paddingTop: '20px' }}
            />
            <Line
              type="monotone"
              dataKey="conservative"
              stroke="url(#colorConservativeLine)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="stable"
              stroke="url(#colorStableLine)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="aggressive"
              stroke="url(#colorAggressiveLine)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="divider-gold my-6" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title={`${years}年后预计总资产`}
          value={formatCurrency(finalAssets)}
          icon={<PiggyBank size={24} />}
          color="gold"
          suffix="元"
        />
        <StatCard
          title="累计净收益"
          value={formatCurrency(totalProfit)}
          icon={<TrendingUp size={24} />}
          color={totalProfit >= 0 ? 'emerald' : 'crimson'}
          suffix="元"
        />
        <StatCard
          title="资产翻倍所需时间"
          value={doubleYear !== null ? `${doubleYear}年` : `>${years}年`}
          icon={<Clock size={24} />}
          color={doubleYear !== null ? 'emerald' : 'gold'}
        />
      </div>
    </div>
  );
}

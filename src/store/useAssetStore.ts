import { create } from 'zustand';
import type { AssetCategory, AssetItem, PlanType, AllocationPlan, IncomeResult } from '@/types';

const defaultAssets: AssetItem[] = [
  {
    category: 'real_estate',
    name: '地产',
    selected: true,
    value: 500,
    expectedReturn: 4.5,
    monthlyIncome: 8000,
    monthlyExpense: 2000,
  },
  {
    category: 'fund',
    name: '基金',
    selected: true,
    value: 200,
    expectedReturn: 7,
    monthlyIncome: 0,
    monthlyExpense: 0,
  },
  {
    category: 'private_enterprise',
    name: '私人企业',
    selected: true,
    value: 300,
    expectedReturn: 12,
    monthlyIncome: 15000,
    monthlyExpense: 5000,
  },
  {
    category: 'collection',
    name: '藏品',
    selected: true,
    value: 100,
    expectedReturn: 6,
    monthlyIncome: 0,
    monthlyExpense: 500,
  },
];

const defaultPlans: Record<PlanType, AllocationPlan> = {
  conservative: {
    type: 'conservative',
    name: '保守型',
    description: '低风险稳健配置，优先保障资产安全',
    allocations: { real_estate: 50, fund: 25, private_enterprise: 10, collection: 15 },
    expectedAnnualReturn: 0,
    expectedMonthlyReturn: 0,
    riskLevel: 'low',
  },
  stable: {
    type: 'stable',
    name: '稳健型',
    description: '平衡风险与收益，追求稳定增长',
    allocations: { real_estate: 35, fund: 35, private_enterprise: 15, collection: 15 },
    expectedAnnualReturn: 0,
    expectedMonthlyReturn: 0,
    riskLevel: 'medium',
  },
  aggressive: {
    type: 'aggressive',
    name: '扩张型',
    description: '高风险高收益，追求资产快速增值',
    allocations: { real_estate: 20, fund: 40, private_enterprise: 25, collection: 15 },
    expectedAnnualReturn: 0,
    expectedMonthlyReturn: 0,
    riskLevel: 'high',
  },
};

interface AssetState {
  assets: AssetItem[];
  incomeResult: IncomeResult;
  plans: Record<PlanType, AllocationPlan>;
  activePlan: PlanType;
  customAllocations: Record<AssetCategory, number>;

  toggleAsset: (category: AssetCategory) => void;
  updateAssetValue: (category: AssetCategory, field: keyof AssetItem, value: number) => void;
  setActivePlan: (plan: PlanType) => void;
  updateCustomAllocation: (category: AssetCategory, value: number) => void;
  calculateIncome: () => void;
  calculatePlans: () => void;
  getTotalInvestment: () => number;
  getSelectedAssets: () => AssetItem[];
}

export const useAssetStore = create<AssetState>((set, get) => ({
  assets: defaultAssets,
  incomeResult: {
    monthlyFixedIncome: 0,
    monthlyFixedExpense: 0,
    monthlyCashFlow: 0,
    annualCashFlow: 0,
    isSurplus: true,
  },
  plans: defaultPlans,
  activePlan: 'stable',
  customAllocations: { real_estate: 35, fund: 35, private_enterprise: 15, collection: 15 },

  toggleAsset: (category) => {
    set((state) => ({
      assets: state.assets.map((asset) =>
        asset.category === category ? { ...asset, selected: !asset.selected } : asset
      ),
    }));
    get().calculateIncome();
    get().calculatePlans();
  },

  updateAssetValue: (category, field, value) => {
    set((state) => ({
      assets: state.assets.map((asset) =>
        asset.category === category ? { ...asset, [field]: value } : asset
      ),
    }));
    get().calculateIncome();
    get().calculatePlans();
  },

  setActivePlan: (plan) => {
    set({ activePlan: plan });
  },

  updateCustomAllocation: (category, value) => {
    set((state) => {
      const newAllocations = { ...state.customAllocations, [category]: value };
      const total = Object.values(newAllocations).reduce((sum, v) => sum + v, 0);
      if (total > 0) {
        Object.keys(newAllocations).forEach((key) => {
          newAllocations[key as AssetCategory] = Math.round(
            (newAllocations[key as AssetCategory] / total) * 100
          );
        });
      }
      return { customAllocations: newAllocations };
    });
  },

  calculateIncome: () => {
    const selectedAssets = get().getSelectedAssets();
    const monthlyFixedIncome = selectedAssets.reduce((sum, a) => sum + a.monthlyIncome, 0);
    const monthlyFixedExpense = selectedAssets.reduce((sum, a) => sum + a.monthlyExpense, 0);
    const monthlyCashFlow = monthlyFixedIncome - monthlyFixedExpense;
    const annualCashFlow = monthlyCashFlow * 12;

    set({
      incomeResult: {
        monthlyFixedIncome,
        monthlyFixedExpense,
        monthlyCashFlow,
        annualCashFlow,
        isSurplus: monthlyCashFlow >= 0,
      },
    });
  },

  calculatePlans: () => {
    const { assets } = get();
    const totalInvestment = get().getTotalInvestment() * 10000;

    const calculateReturn = (allocations: Record<AssetCategory, number>) => {
      return assets.reduce((total, asset) => {
        const allocationAmount = (totalInvestment * allocations[asset.category]) / 100;
        return total + (allocationAmount * asset.expectedReturn) / 100;
      }, 0);
    };

    set((state) => {
      const newPlans = { ...state.plans };
      (Object.keys(newPlans) as PlanType[]).forEach((planType) => {
        const annualReturn = calculateReturn(newPlans[planType].allocations);
        newPlans[planType] = {
          ...newPlans[planType],
          expectedAnnualReturn: annualReturn,
          expectedMonthlyReturn: annualReturn / 12,
        };
      });
      return { plans: newPlans };
    });
  },

  getTotalInvestment: () => {
    return get().getSelectedAssets().reduce((sum, a) => sum + a.value, 0);
  },

  getSelectedAssets: () => {
    return get().assets.filter((a) => a.selected);
  },
}));

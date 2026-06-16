import type { AssetCategory, AssetItem, AllocationPlan, IncomeResult, PlanType } from '@/types';

const API_BASE = '/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export async function fetchDefaultAssets(): Promise<AssetItem[]> {
  try {
    const response = await fetch(`${API_BASE}/assets/defaults`);
    const data = (await response.json()) as ApiResponse<AssetItem[]>;
    if (data.success) {
      return data.data;
    }
    throw new Error('Failed to fetch default assets');
  } catch {
    return [
      {
        category: 'real_estate',
        name: '地产',
        selected: false,
        value: 500,
        expectedReturn: 4.5,
        monthlyIncome: 8000,
        monthlyExpense: 2000,
      },
      {
        category: 'fund',
        name: '基金',
        selected: false,
        value: 200,
        expectedReturn: 7,
        monthlyIncome: 0,
        monthlyExpense: 0,
      },
      {
        category: 'private_enterprise',
        name: '私人企业',
        selected: false,
        value: 300,
        expectedReturn: 12,
        monthlyIncome: 15000,
        monthlyExpense: 5000,
      },
      {
        category: 'collection',
        name: '藏品',
        selected: false,
        value: 100,
        expectedReturn: 6,
        monthlyIncome: 0,
        monthlyExpense: 500,
      },
    ];
  }
}

export async function calculateIncome(assets: AssetItem[]): Promise<IncomeResult> {
  try {
    const response = await fetch(`${API_BASE}/calculate/income`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assets }),
    });
    const data = (await response.json()) as ApiResponse<IncomeResult>;
    if (data.success) {
      return data.data;
    }
    throw new Error('Failed to calculate income');
  } catch {
    const monthlyFixedIncome = assets
      .filter((a) => a.selected)
      .reduce((sum, a) => sum + a.monthlyIncome, 0);
    const monthlyFixedExpense = assets
      .filter((a) => a.selected)
      .reduce((sum, a) => sum + a.monthlyExpense, 0);
    const monthlyCashFlow = monthlyFixedIncome - monthlyFixedExpense;
    const annualCashFlow = monthlyCashFlow * 12;
    return {
      monthlyFixedIncome,
      monthlyFixedExpense,
      monthlyCashFlow,
      annualCashFlow,
      isSurplus: monthlyCashFlow >= 0,
    };
  }
}

export async function calculatePlans(
  assets: AssetItem[],
  totalInvestment: number
): Promise<Record<PlanType, AllocationPlan>> {
  try {
    const response = await fetch(`${API_BASE}/calculate/plans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assets, totalInvestment }),
    });
    const data = (await response.json()) as ApiResponse<Record<PlanType, AllocationPlan>>;
    if (data.success) {
      return data.data;
    }
    throw new Error('Failed to calculate plans');
  } catch {
    const defaultAllocations: Record<PlanType, Record<AssetCategory, number>> = {
      conservative: { real_estate: 50, fund: 25, private_enterprise: 10, collection: 15 },
      stable: { real_estate: 35, fund: 35, private_enterprise: 15, collection: 15 },
      aggressive: { real_estate: 20, fund: 40, private_enterprise: 25, collection: 15 },
    };

    const totalInvestmentYuan = totalInvestment * 10000;

    const calculateReturn = (allocations: Record<AssetCategory, number>) => {
      return assets.reduce((total, asset) => {
        const allocationAmount = (totalInvestmentYuan * allocations[asset.category]) / 100;
        return total + (allocationAmount * asset.expectedReturn) / 100;
      }, 0);
    };

    const plans: PlanType[] = ['conservative', 'stable', 'aggressive'];
    const names: Record<PlanType, string> = {
      conservative: '保守型',
      stable: '稳健型',
      aggressive: '扩张型',
    };
    const descriptions: Record<PlanType, string> = {
      conservative: '低风险稳健配置，优先保障资产安全',
      stable: '平衡风险与收益，追求稳定增长',
      aggressive: '高风险高收益，追求资产快速增值',
    };
    const riskLevels: Record<PlanType, 'low' | 'medium' | 'high'> = {
      conservative: 'low',
      stable: 'medium',
      aggressive: 'high',
    };

    const result = {} as Record<PlanType, AllocationPlan>;
    plans.forEach((plan) => {
      const annualReturn = calculateReturn(defaultAllocations[plan]);
      result[plan] = {
        type: plan,
        name: names[plan],
        description: descriptions[plan],
        allocations: defaultAllocations[plan],
        expectedAnnualReturn: annualReturn,
        expectedMonthlyReturn: annualReturn / 12,
        riskLevel: riskLevels[plan],
      };
    });

    return result;
  }
}

export async function calculateCustomAllocation(
  assets: AssetItem[],
  totalInvestment: number,
  customAllocations: Record<AssetCategory, number>
): Promise<{
  expectedAnnualReturn: number;
  expectedMonthlyReturn: number;
  allocations: Record<AssetCategory, number>;
}> {
  try {
    const response = await fetch(`${API_BASE}/calculate/custom`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assets, totalInvestment, customAllocations }),
    });
    const data = (await response.json()) as ApiResponse<{
      expectedAnnualReturn: number;
      expectedMonthlyReturn: number;
      allocations: Record<AssetCategory, number>;
    }>;
    if (data.success) {
      return data.data;
    }
    throw new Error('Failed to calculate custom allocation');
  } catch {
    const totalInvestmentYuan = totalInvestment * 10000;
    const expectedAnnualReturn = assets.reduce((total, asset) => {
      const allocationAmount = (totalInvestmentYuan * customAllocations[asset.category]) / 100;
      return total + (allocationAmount * asset.expectedReturn) / 100;
    }, 0);
    return {
      expectedAnnualReturn,
      expectedMonthlyReturn: expectedAnnualReturn / 12,
      allocations: customAllocations,
    };
  }
}

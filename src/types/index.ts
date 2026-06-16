export type AssetCategory = 'real_estate' | 'fund' | 'private_enterprise' | 'collection';

export interface AssetItem {
  category: AssetCategory;
  name: string;
  selected: boolean;
  value: number;
  expectedReturn: number;
  monthlyIncome: number;
  monthlyExpense: number;
}

export type PlanType = 'conservative' | 'stable' | 'aggressive';

export interface AllocationPlan {
  type: PlanType;
  name: string;
  description: string;
  allocations: Record<AssetCategory, number>;
  expectedAnnualReturn: number;
  expectedMonthlyReturn: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface IncomeResult {
  monthlyFixedIncome: number;
  monthlyFixedExpense: number;
  monthlyCashFlow: number;
  annualCashFlow: number;
  isSurplus: boolean;
}

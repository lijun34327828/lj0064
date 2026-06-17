import { Router, type Request, type Response } from 'express'
import type {
  AssetItem,
  AssetCategory,
  AllocationPlan,
  IncomeResult,
  ProjectionResult,
  ProjectionYearData,
  PlanType,
} from '../../shared/types/index.js'

const router = Router()

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
]

const planAllocations: Record<string, Record<AssetCategory, number>> = {
  conservative: {
    real_estate: 50,
    fund: 25,
    private_enterprise: 10,
    collection: 15,
  },
  stable: {
    real_estate: 35,
    fund: 35,
    private_enterprise: 15,
    collection: 15,
  },
  aggressive: {
    real_estate: 20,
    fund: 40,
    private_enterprise: 25,
    collection: 15,
  },
}

const planConfigs: Record<string, { name: string; description: string; riskLevel: 'low' | 'medium' | 'high' }> = {
  conservative: {
    name: '保守型',
    description: '侧重稳定收益，地产占比较高',
    riskLevel: 'low',
  },
  stable: {
    name: '稳健型',
    description: '平衡收益与风险，均衡配置',
    riskLevel: 'medium',
  },
  aggressive: {
    name: '扩张型',
    description: '追求高收益，高风险资产占比较高',
    riskLevel: 'high',
  },
}

function calculateExpectedReturns(
  totalInvestment: number,
  allocations: Record<AssetCategory, number>,
  assets: AssetItem[]
): { annualReturn: number; monthlyReturn: number } {
  let annualReturn = 0
  const assetMap: Record<string, AssetItem> = {}
  assets.forEach((asset) => {
    assetMap[asset.category] = asset
  })

  const categories: AssetCategory[] = ['real_estate', 'fund', 'private_enterprise', 'collection']
  categories.forEach((category) => {
    const asset = assetMap[category]
    if (asset) {
      const allocationAmount = totalInvestment * (allocations[category] / 100)
      annualReturn += allocationAmount * 10000 * (asset.expectedReturn / 100)
    }
  })

  return {
    annualReturn,
    monthlyReturn: annualReturn / 12,
  }
}

router.get('/api/assets/defaults', (req: Request, res: Response): void => {
  res.json({
    success: true,
    data: defaultAssets,
  })
})

router.post('/api/calculate/income', (req: Request, res: Response): void => {
  const { assets } = req.body as { assets: AssetItem[] }

  if (!assets || !Array.isArray(assets)) {
    res.json({
      success: false,
      data: null,
    })
    return
  }

  let monthlyFixedIncome = 0
  let monthlyFixedExpense = 0

  assets.forEach((asset) => {
    if (asset.selected) {
      monthlyFixedIncome += asset.monthlyIncome || 0
      monthlyFixedExpense += asset.monthlyExpense || 0
    }
  })

  const monthlyCashFlow = monthlyFixedIncome - monthlyFixedExpense
  const annualCashFlow = monthlyCashFlow * 12

  const result: IncomeResult = {
    monthlyFixedIncome,
    monthlyFixedExpense,
    monthlyCashFlow,
    annualCashFlow,
    isSurplus: monthlyCashFlow >= 0,
  }

  res.json({
    success: true,
    data: result,
  })
})

router.post('/api/calculate/plans', (req: Request, res: Response): void => {
  const { assets, totalInvestment } = req.body as { assets: AssetItem[]; totalInvestment: number }

  if (!assets || !Array.isArray(assets) || typeof totalInvestment !== 'number') {
    res.json({
      success: false,
      data: null,
    })
    return
  }

  const planTypes = ['conservative', 'stable', 'aggressive'] as const
  const result: Record<string, AllocationPlan> = {}

  planTypes.forEach((type) => {
    const allocations = planAllocations[type]
    const returns = calculateExpectedReturns(totalInvestment, allocations, assets)
    const config = planConfigs[type]

    result[type] = {
      type,
      name: config.name,
      description: config.description,
      allocations: { ...allocations },
      expectedAnnualReturn: returns.annualReturn,
      expectedMonthlyReturn: returns.monthlyReturn,
      riskLevel: config.riskLevel,
    }
  })

  res.json({
    success: true,
    data: result,
  })
})

router.post('/api/calculate/custom', (req: Request, res: Response): void => {
  const {
    assets,
    totalInvestment,
    customAllocations,
  } = req.body as {
    assets: AssetItem[]
    totalInvestment: number
    customAllocations: Record<AssetCategory, number>
  }

  if (!assets || !Array.isArray(assets) || typeof totalInvestment !== 'number' || !customAllocations) {
    res.json({
      success: false,
      data: null,
    })
    return
  }

  const returns = calculateExpectedReturns(totalInvestment, customAllocations, assets)

  res.json({
    success: true,
    data: {
      expectedAnnualReturn: returns.annualReturn,
      expectedMonthlyReturn: returns.monthlyReturn,
      allocations: customAllocations,
    },
  })
})

function calculateProjection(
  assets: AssetItem[],
  totalInvestment: number,
  years: number
): ProjectionResult {
  const planTypes: PlanType[] = ['conservative', 'stable', 'aggressive']
  const initialPrincipal = totalInvestment * 10000

  let annualCashFlow = 0
  assets.forEach((asset) => {
    if (asset.selected) {
      const monthlyCashFlow = (asset.monthlyIncome || 0) - (asset.monthlyExpense || 0)
      annualCashFlow += monthlyCashFlow * 12
    }
  })

  const planReturns: Record<PlanType, number> = {
    conservative: 0,
    stable: 0,
    aggressive: 0,
  }

  planTypes.forEach((planType) => {
    const allocations = planAllocations[planType]
    const returns = calculateExpectedReturns(totalInvestment, allocations, assets)
    planReturns[planType] = returns.annualReturn
  })

  const yearData: ProjectionYearData[] = []
  const currentAssets: Record<PlanType, number> = {
    conservative: initialPrincipal,
    stable: initialPrincipal,
    aggressive: initialPrincipal,
  }

  const doubleYears: Record<PlanType, number | null> = {
    conservative: null,
    stable: null,
    aggressive: null,
  }

  yearData.push({
    year: 0,
    conservative: currentAssets.conservative,
    stable: currentAssets.stable,
    aggressive: currentAssets.aggressive,
  })

  for (let i = 1; i <= years; i++) {
    planTypes.forEach((planType) => {
      const returnRate = initialPrincipal > 0 ? planReturns[planType] / initialPrincipal : 0
      const yearReturn = currentAssets[planType] * returnRate
      currentAssets[planType] = currentAssets[planType] + yearReturn + annualCashFlow

      if (doubleYears[planType] === null && currentAssets[planType] >= initialPrincipal * 2) {
        doubleYears[planType] = i
      }
    })

    yearData.push({
      year: i,
      conservative: currentAssets.conservative,
      stable: currentAssets.stable,
      aggressive: currentAssets.aggressive,
    })
  }

  const finalAssets: Record<PlanType, number> = {
    conservative: currentAssets.conservative,
    stable: currentAssets.stable,
    aggressive: currentAssets.aggressive,
  }

  const totalProfit: Record<PlanType, number> = {
    conservative: finalAssets.conservative - initialPrincipal - annualCashFlow * years,
    stable: finalAssets.stable - initialPrincipal - annualCashFlow * years,
    aggressive: finalAssets.aggressive - initialPrincipal - annualCashFlow * years,
  }

  return {
    years: yearData,
    finalAssets,
    totalProfit,
    doubleYears,
  }
}

router.post('/api/calculate/projection', (req: Request, res: Response): void => {
  const { assets, years } = req.body as {
    assets: AssetItem[]
    years: number
  }

  if (!assets || !Array.isArray(assets) || typeof years !== 'number' || years < 1 || years > 30) {
    res.json({
      success: false,
      data: null,
    })
    return
  }

  const selectedAssets = assets.filter((a) => a.selected)
  const totalInvestment = selectedAssets.reduce((sum, a) => sum + (a.value || 0), 0)

  const result = calculateProjection(assets, totalInvestment, years)

  res.json({
    success: true,
    data: result,
  })
})

export default router

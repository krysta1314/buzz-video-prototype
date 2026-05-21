import {
  PAID_PLANS,
  MODEL_BY_ID,
  type BillingCycle,
  type ModelId,
  type PaidPlanId,
  type PlanId,
  type Scale,
} from '@/config/pricing';

export interface PriceBreakdown {
  /** Strike-through monthly price (only shown in yearly state) */
  monthlyPrice: number;
  /** Headline price displayed per "/ mo" */
  displayPrice: number;
  /** Annual total (only meaningful in yearly state) */
  annualTotal: number;
}

export function computePrice(planId: PaidPlanId, scale: Scale, cycle: BillingCycle): PriceBreakdown {
  const p = PAID_PLANS[planId];
  const monthlyPrice = p.baseMonthlyPrice * scale;
  if (cycle === 'monthly') {
    return { monthlyPrice, displayPrice: monthlyPrice, annualTotal: monthlyPrice * 12 };
  }
  return {
    monthlyPrice,
    displayPrice: p.baseYearlyMonthlyPrice * scale,
    annualTotal: p.baseYearlyAnnualTotal * scale,
  };
}

/** Credits available in this billing cycle for a paid plan */
export function computeCredits(planId: PaidPlanId, scale: Scale, cycle: BillingCycle): number {
  const base = PAID_PLANS[planId].baseMonthlyCredits * scale;
  return cycle === 'monthly' ? base : base * 12;
}

/** Compare table cell: how many generations of a given model can be produced */
export function computeGenerations(credits: number, modelId: ModelId): number {
  return Math.floor(credits / MODEL_BY_ID[modelId].pricePerUnit);
}

/** Credits available in Plan Cards for any plan (free returns one-time amount) */
export function computeCreditsForPlan(
  planId: PlanId,
  scaleOrUndefined: Scale | undefined,
  cycle: BillingCycle,
  freeOneTimeCredits: number,
): { credits: number; isOneTime: boolean } {
  if (planId === 'free') return { credits: freeOneTimeCredits, isOneTime: true };
  return { credits: computeCredits(planId, scaleOrUndefined ?? 1, cycle), isOneTime: false };
}

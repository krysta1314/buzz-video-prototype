import { useState, useCallback } from 'react';
import type { BillingCycle, PaidPlanId, Scale } from '@/config/pricing';

export type ScaleMap = Record<PaidPlanId, Scale>;

export interface RegionState {
  cycle: BillingCycle;
  scales: ScaleMap;
  setCycle: (c: BillingCycle) => void;
  setScale: (plan: PaidPlanId, s: Scale) => void;
}

/**
 * Per PRD §11: Plan Cards and Compare Features each have their own
 * independent billing cycle and per-plan scales. Switching cycle
 * preserves the current scale selections.
 */
function useRegion(initialScales: ScaleMap): RegionState {
  const [cycle, setCycle] = useState<BillingCycle>('yearly');
  const [scales, setScales] = useState<ScaleMap>(initialScales);
  const setScale = useCallback((plan: PaidPlanId, s: Scale) => {
    setScales(prev => ({ ...prev, [plan]: s }));
  }, []);
  return { cycle, scales, setCycle, setScale };
}

export interface PricingState {
  cards: RegionState;
  cmp: RegionState;
}

// Starter is a fixed-price plan (no slider) — always 1. Pro/Ultra default to 2x per PRD §11.
const DEFAULT_SCALES: ScaleMap = { starter: 1, pro: 2, ultra: 2 };

export function usePricingState(): PricingState {
  const cards = useRegion(DEFAULT_SCALES);
  const cmp = useRegion(DEFAULT_SCALES);
  return { cards, cmp };
}

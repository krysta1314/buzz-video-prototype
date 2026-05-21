import { PAID_PLAN_ORDER } from '@/config/pricing';
import type { RegionState } from '@/hooks/usePricingState';
import { FreePlanCard, PaidPlanCard } from './PlanCard';

interface PlanCardsProps {
  region: RegionState;
}

/**
 * At xl breakpoint (4 cols), use CSS subgrid so every internal section
 * (header / price / credits / slider / CTA / features) lines up across
 * all 4 cards. Below xl, cards stack and subgrid is not needed.
 */
export function PlanCards({ region }: PlanCardsProps) {
  return (
    <>
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
        <FreePlanCard />
        {PAID_PLAN_ORDER.map(planId => (
          <PaidPlanCard
            key={planId}
            planId={planId}
            cycle={region.cycle}
            scale={region.scales[planId]}
            onScaleChange={(s) => region.setScale(planId, s)}
          />
        ))}
      </section>
      <ul className="text-[11px] text-neutral-500 mt-5 max-w-[920px] leading-relaxed list-disc pl-4 space-y-1">
        <li>&ldquo;Month&rdquo; in <code className="text-[11px]">X-Day Unlimited/Month</code> refers to your subscription cycle (starting from your purchase or renewal date), not the calendar month.</li>
        <li>Usage during the access window consumes credits.</li>
        <li>Yearly plans deliver all credits upfront.</li>
        <li>Credits reset at the beginning of each billing cycle.</li>
      </ul>
    </>
  );
}

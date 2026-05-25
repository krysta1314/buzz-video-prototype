import { PAID_PLAN_ORDER } from '@/config/pricing';
import type { RegionState } from '@/hooks/usePricingState';
import type { UserRole } from '@/hooks/useUserRole';
import { FreePlanCard, PaidPlanCard } from './PlanCard';

interface PlanCardsProps {
  region: RegionState;
  role: UserRole;
}

export function PlanCards({ region, role }: PlanCardsProps) {
  const isSubscribed = role !== 'free';

  return (
    <>
      <section
        className={
          'grid grid-cols-1 sm:grid-cols-2 gap-5 items-start ' +
          (isSubscribed ? 'xl:grid-cols-3' : 'xl:grid-cols-4')
        }
      >
        {!isSubscribed && <FreePlanCard />}
        {PAID_PLAN_ORDER.map(planId => (
          <PaidPlanCard
            key={planId}
            planId={planId}
            cycle={region.cycle}
            scale={region.scales[planId]}
            onScaleChange={(s) => region.setScale(planId, s)}
            currentRole={role}
          />
        ))}
      </section>
      <ul className="text-[11px] text-neutral-500 mt-5 max-w-[920px] leading-relaxed list-disc pl-4 space-y-1">
        <li>Yearly plans deliver all credits upfront.</li>
        <li>Credits reset at the beginning of each billing cycle.</li>
      </ul>
    </>
  );
}

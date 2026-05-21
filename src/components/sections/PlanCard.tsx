import {
  FREE_PLAN,
  PAID_PLANS,
  MODEL_BY_ID,
  type BillingCycle,
  type PaidPlanId,
  type Scale,
} from '@/config/pricing';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ScalingSlider } from '@/components/ui/ScalingSlider';
import { FeatureMatrix } from './FeatureMatrix';
import { computeCredits, computeGenerations, computePrice } from '@/lib/compute';
import { fmtMoney, fmtNumber } from '@/lib/format';

/**
 * Layout: flex column. Top sections share min-heights so they
 * roughly align across cards; FeatureMatrix below flows naturally.
 */
const CARD_BASE =
  'relative bg-white rounded-2xl p-6 flex flex-col gap-3.5';

/** Per-row min-heights to keep top sections aligned across cards. */
const ROW = {
  header: 'min-h-[60px]',
  price: 'min-h-[64px]',
  credits: 'min-h-[180px]',
  save: 'min-h-[16px]',
} as const;

const variantClasses = {
  free: 'border border-neutral-200',
  starter: 'border border-neutral-200',
  pro: 'border-2 border-accent shadow-card-pro',
  ultra: 'border-2 border-secondary shadow-card-ultra',
} as const;

const ctaVariants = {
  starter: 'dark',
  pro: 'accent',
  ultra: 'secondary',
} as const;

interface PaidCardProps {
  planId: PaidPlanId;
  cycle: BillingCycle;
  scale: Scale;
  onScaleChange: (s: Scale) => void;
}

export function PaidPlanCard({ planId, cycle, scale, onScaleChange }: PaidCardProps) {
  const plan = PAID_PLANS[planId];
  const price = computePrice(planId, scale, cycle);
  const credits = computeCredits(planId, scale, cycle);
  const imgModel = MODEL_BY_ID[plan.exampleImageModel];
  const vidModel = MODEL_BY_ID[plan.exampleVideoModel];
  const imgCount = computeGenerations(credits, plan.exampleImageModel);
  const vidCount = computeGenerations(credits, plan.exampleVideoModel);
  const isYearly = cycle === 'yearly';
  const savings = price.monthlyPrice * 12 - price.annualTotal;

  return (
    <article
      className={`${CARD_BASE} ${variantClasses[planId]}`}
      aria-labelledby={`plan-${planId}-name`}
    >
      {plan.badge && <Badge variant={plan.badge.variant}>{plan.badge.label}</Badge>}

      <header className={ROW.header}>
        <h3 id={`plan-${planId}-name`} className="text-2xl font-bold tracking-tight">{plan.name}</h3>
        <p className="text-xs text-neutral-500 mt-1">{plan.tagline}</p>
      </header>

      <div className={ROW.price}>
        <div className="flex items-baseline gap-2 flex-wrap">
          {isYearly && (
            <span className="text-[22px] text-rose-500 line-through font-bold tracking-tight">
              {fmtMoney(price.monthlyPrice)}
            </span>
          )}
          <span className="text-[32px] font-bold tracking-tight leading-none">
            {fmtMoney(price.displayPrice)}
          </span>
          <span className="text-[13px] text-neutral-500 font-medium">/ mo</span>
        </div>
      </div>

      <div className={`bg-neutral-50 rounded-[10px] p-3 text-xs leading-[1.5] flex flex-col gap-2 ${ROW.credits}`}>
        <div className="font-semibold text-[13px] text-ink">
          {fmtNumber(credits)} credits/{isYearly ? 'year' : 'month'}
        </div>
        <div className="text-neutral-500">
          <div>≈ {fmtNumber(imgCount)} {imgModel.name} {imgModel.unitLabel}s</div>
          <div>≈ {fmtNumber(vidCount)} {vidModel.name} {vidModel.unitLabel}s ({vidModel.sku})</div>
        </div>
        <div className="mt-auto pt-2">
          <ScalingSlider value={scale} onChange={onScaleChange} ariaLabel={`${plan.name} credit multiplier`} />
        </div>
      </div>

      <Button variant={ctaVariants[planId]}>{plan.cta}</Button>

      <div className={`text-center text-xs text-neutral-500 ${ROW.save}`}>
        {isYearly && (
          <>
            <span className="font-semibold text-ink">Save {fmtMoney(savings)}</span> compared to monthly
          </>
        )}
      </div>

      <FeatureMatrix planId={planId} />
    </article>
  );
}

export function FreePlanCard() {
  return (
    <article
      className={`${CARD_BASE} ${variantClasses.free}`}
      aria-labelledby="plan-free-name"
    >
      <header className={ROW.header}>
        <h3 id="plan-free-name" className="text-2xl font-bold tracking-tight">{FREE_PLAN.name}</h3>
        <p className="text-xs text-neutral-500 mt-1">{FREE_PLAN.tagline}</p>
      </header>

      <div className={ROW.price}>
        <div className="flex items-baseline gap-1">
          <span className="text-[32px] font-bold tracking-tight leading-none">$0</span>
        </div>
      </div>

      <div className={`bg-neutral-50 rounded-[10px] p-3 text-xs leading-[1.5] flex flex-col gap-2 ${ROW.credits}`}>
        <div className="font-semibold text-[13px] text-ink">
          {fmtNumber(FREE_PLAN.oneTimeCredits)} credits{' '}
          <span className="text-neutral-500 font-normal">(one-time)</span>
        </div>
        <div className="text-neutral-500">{FREE_PLAN.exampleSub}</div>
      </div>

      <Button variant="outline">{FREE_PLAN.cta}</Button>

      {/* Empty placeholder matching the Save line slot on paid cards */}
      <div className={ROW.save} aria-hidden />

      <FeatureMatrix planId="free" />
    </article>
  );
}

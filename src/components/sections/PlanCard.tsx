import {
  FREE_PLAN,
  PAID_PLANS,
  MODEL_BY_ID,
  SCALE_DISCOUNTS,
  type BillingCycle,
  type PaidPlanId,
  type Scale,
} from '@/config/pricing';
import type { UserRole } from '@/hooks/useUserRole';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { InfoIcon } from '@/components/ui/InfoIcon';
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

/** Tier order: lower index = lower plan. */
const TIER_RANK: Record<UserRole, number> = { free: 0, starter: 1, pro: 2, ultra: 3 };

type CtaVariant = 'default' | 'upgrade' | 'current' | 'downgrade';

function getCtaVariant(role: UserRole, planId: PaidPlanId): CtaVariant {
  if (role === 'free') return 'default';
  if (role === planId) return 'current';
  return TIER_RANK[planId] > TIER_RANK[role] ? 'upgrade' : 'downgrade';
}

interface PaidCardProps {
  planId: PaidPlanId;
  cycle: BillingCycle;
  scale: Scale;
  onScaleChange: (s: Scale) => void;
  currentRole: UserRole;
}

export function PaidPlanCard({ planId, cycle, scale, onScaleChange, currentRole }: PaidCardProps) {
  const plan = PAID_PLANS[planId];
  const isFixedPrice = planId === 'starter';
  const effectiveScale: Scale = isFixedPrice ? 1 : scale;
  const price = computePrice(planId, effectiveScale, cycle);
  const credits = computeCredits(planId, effectiveScale, cycle);
  const imgModel = MODEL_BY_ID[plan.exampleImageModel];
  const vidModel = MODEL_BY_ID[plan.exampleVideoModel];
  const imgCount = computeGenerations(credits, plan.exampleImageModel);
  const vidCount = computeGenerations(credits, plan.exampleVideoModel);
  const isYearly = cycle === 'yearly';
  const savings = price.monthlyPrice * 12 - price.annualTotal;

  const ctaVariant = getCtaVariant(currentRole, planId);
  const isCurrent = ctaVariant === 'current';

  return (
    <article
      className={`${CARD_BASE} ${variantClasses[planId]}`}
      aria-labelledby={`plan-${planId}-name`}
    >
      {/* Top badge: Current Plan replaces plan.badge when this is the user's plan */}
      {isCurrent ? (
        <CurrentPlanBadge planId={planId} />
      ) : (
        plan.badge && <Badge variant={plan.badge.variant}>{plan.badge.label}</Badge>
      )}

      <header className={ROW.header}>
        <div className="flex items-center gap-2 flex-wrap">
          <h3 id={`plan-${planId}-name`} className="text-2xl font-bold tracking-tight">{plan.name}</h3>
          {SCALE_DISCOUNTS[effectiveScale] > 0 && (
            <span
              className="inline-flex items-center text-[13px] font-extrabold text-white px-3 py-1 leading-none tracking-wider"
              style={{
                background: 'linear-gradient(135deg, #ff0051 0%, #ff3d7a 100%)',
                transform: 'skewX(-14deg)',
                boxShadow: '0 4px 12px rgba(255, 0, 81, 0.28)',
                borderRadius: '4px',
              }}
            >
              <span style={{ transform: 'skewX(14deg)', display: 'inline-block' }}>
                {Math.round(SCALE_DISCOUNTS[effectiveScale] * 100)}% OFF
              </span>
            </span>
          )}
        </div>
        <p className="text-sm text-neutral-600 mt-1.5 leading-snug">{plan.tagline}</p>
      </header>

      <div className={ROW.price}>
        <div className="flex items-baseline gap-2 flex-wrap">
          {price.displayPrice < price.referencePrice && (
            <span className="text-[23px] text-neutral-400 line-through font-bold tracking-tight">
              {fmtMoney(price.referencePrice)}
            </span>
          )}
          <span className="text-[40px] font-bold tracking-tight leading-none">
            {fmtMoney(price.displayPrice)}
          </span>
          <span className="text-[13px] text-neutral-500 font-medium">/ mo</span>
        </div>
      </div>

      <div className={`bg-neutral-50 rounded-[10px] p-3 text-xs leading-[1.5] flex flex-col gap-2 ${ROW.credits}`}>
        <div className="font-semibold text-[13px] text-ink flex items-center gap-1">
          <span>{fmtNumber(credits)} credits/{isYearly ? 'year' : 'month'}</span>
          {isYearly && (
            <InfoIcon label="Yearly credits delivery">
              Yearly plans deliver all credits upfront upon successful subscription.
            </InfoIcon>
          )}
        </div>
        <div className="text-neutral-500">
          <div>≈ {fmtNumber(imgCount)} {imgModel.name} {imgModel.unitLabel}s</div>
          <div>≈ {fmtNumber(vidCount)} {vidModel.name} {vidModel.unitLabel}s ({vidModel.sku})</div>
        </div>
        {!isFixedPrice && (
          <div className="mt-auto pt-2">
            <ScalingSlider value={scale} onChange={onScaleChange} ariaLabel={`${plan.name} credit multiplier`} />
          </div>
        )}
        {isFixedPrice && (
          <div className="mt-auto pt-2">
            <div
              className="flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-medium text-neutral-700 border border-white/70 shadow-sm backdrop-blur-md"
              style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.55) 100%)' }}
            >
              <span aria-hidden className="text-emerald-600 font-bold leading-none">✓</span>
              Fixed amount of {fmtNumber(credits)} credits/{isYearly ? 'year' : 'mo'}
            </div>
          </div>
        )}
      </div>

      <RoleAwareCTA variant={ctaVariant} planId={planId} planName={plan.name} fallbackCta={plan.cta} />

      <div className={`text-center text-xs text-neutral-500 ${ROW.save}`}>
        {isYearly && !isCurrent && (
          <>
            <span className="font-semibold text-ink">Save {fmtMoney(savings)}</span> compared to monthly
          </>
        )}
      </div>

      <FeatureMatrix planId={planId} />
    </article>
  );
}

/** Top-edge badge replacing plan.badge when this is the user's current plan. */
function CurrentPlanBadge({ planId }: { planId: PaidPlanId }) {
  const themes: Record<PaidPlanId, { bg: string; text: string }> = {
    starter: { bg: '#0a0a0a',   text: '#ffffff' },
    pro:     { bg: '#f97316',   text: '#ffffff' },
    ultra:   { bg: '#7c3aed',   text: '#ffffff' },
  };
  const t = themes[planId];
  return (
    <span
      className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 text-[11px] font-semibold tracking-wide rounded-full whitespace-nowrap inline-flex items-center gap-1"
      style={{ background: t.bg, color: t.text }}
    >
      <span aria-hidden>✓</span>
      Current Plan
    </span>
  );
}

interface RoleAwareCTAProps {
  variant: CtaVariant;
  planId: PaidPlanId;
  planName: string;
  fallbackCta: string;
}

function RoleAwareCTA({ variant, planId, planName, fallbackCta }: RoleAwareCTAProps) {
  if (variant === 'current') {
    return (
      <div
        className="w-full text-center px-4 py-3 rounded-[10px] font-semibold text-sm bg-neutral-100 text-neutral-500 cursor-default inline-flex items-center justify-center gap-2"
        aria-disabled="true"
      >
        <span aria-hidden>✓</span> Your Current Plan
      </div>
    );
  }
  if (variant === 'upgrade') {
    return <Button variant={ctaVariants[planId]}>Upgrade to {planName}</Button>;
  }
  if (variant === 'downgrade') {
    return (
      <a
        href="#"
        className="block w-full text-center px-4 py-3 rounded-[10px] font-semibold text-sm border border-neutral-300 text-neutral-600 bg-white hover:bg-neutral-50 transition-colors"
      >
        Downgrade to {planName}
      </a>
    );
  }
  // default — free user
  return <Button variant={ctaVariants[planId]}>{fallbackCta}</Button>;
}

export function FreePlanCard() {
  return (
    <article
      className={`${CARD_BASE} ${variantClasses.free}`}
      aria-labelledby="plan-free-name"
    >
      <header className={ROW.header}>
        <h3 id="plan-free-name" className="text-2xl font-bold tracking-tight">{FREE_PLAN.name}</h3>
        <p className="text-sm text-neutral-600 mt-1.5 leading-snug">{FREE_PLAN.tagline}</p>
      </header>

      <div className={ROW.price}>
        <div className="flex items-baseline gap-1">
          <span className="text-[40px] font-bold tracking-tight leading-none">$0</span>
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
      <div className={ROW.save} aria-hidden />
      <FeatureMatrix planId="free" />
    </article>
  );
}

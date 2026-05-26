import { useState } from 'react';
import {
  FAKE_SUBSCRIPTION,
  FREE_PLAN,
  PAID_PLANS,
  MODEL_BY_ID,
  SCALE_DISCOUNTS,
  UPGRADE_DELTAS,
  type BillingCycle,
  type PaidPlanId,
  type Scale,
} from '@/config/pricing';
import type { UserRole } from '@/hooks/useUserRole';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { InfoIcon } from '@/components/ui/InfoIcon';
import { ScalingSlider } from '@/components/ui/ScalingSlider';
import { UpgradePreviewModal, type UpgradeVariant } from '@/components/ui/UpgradePreviewModal';
import { DowngradeChurnModal } from '@/components/ui/DowngradeChurnModal';
import { FeatureMatrix } from './FeatureMatrix';
import { computeCredits, computeGenerations, computePrice } from '@/lib/compute';
import { fmtMoney, fmtNumber } from '@/lib/format';

/**
 * Layout: flex column. Top sections share min-heights so they
 * roughly align across cards; FeatureMatrix below flows naturally.
 */
const CARD_BASE =
  'relative bg-white rounded-2xl p-6 flex flex-col gap-3.5';

// 锁死高度以保证 4 张卡片每一行严格对齐（CTA、Save、KEY FEATURES 都齐平）
const ROW = {
  header: 'min-h-[72px] sm:h-[72px]',
  price: 'min-h-[56px] sm:h-[56px]',
  credits: 'min-h-[180px] sm:h-[180px]',
  save: 'min-h-[18px] sm:h-[18px]',
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
  // Starter and Pro are fixed-price plans — no scaling slider, always 1x.
  // Only Ultra has the slider for power users / agencies.
  const isFixedPrice = planId === 'starter' || planId === 'pro';
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

  // Volume upgrade: 当前 Ultra 用户拖滑块到比订阅倍数更高的档位
  const currentSub = currentRole !== 'free' ? FAKE_SUBSCRIPTION[currentRole] : null;
  const isVolumeUpgrade =
    isCurrent &&
    !isFixedPrice &&
    currentSub !== null &&
    effectiveScale > currentSub.currentScale;

  // Upgrade preview modal state
  const [modalOpen, setModalOpen] = useState(false);
  // 当前 role 是哪个付费 plan（free user 升级时假设从 starter 走，但 free 不该弹 modal — 走默认 CTA）
  const modalFrom: PaidPlanId | null =
    currentRole !== 'free' ? currentRole : null;
  const modalVariant: UpgradeVariant = isVolumeUpgrade ? 'volume' : 'tier';

  const handleUpgradeClick = () => {
    if (modalFrom) setModalOpen(true);
  };

  // Downgrade churn modal state — 降级按钮点击触发拦截
  const [churnOpen, setChurnOpen] = useState(false);
  const handleDowngradeClick = () => {
    if (modalFrom) setChurnOpen(true);
  };

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

      {/* 升级差量 callout — 仅订阅用户看高 tier 卡时显示，配色跟 plan tier 走 */}
      {ctaVariant === 'upgrade' && currentRole !== 'free' && (
        <UpgradeDeltaCallout
          from={currentRole as PaidPlanId}
          to={planId}
          tone={planId}
          cycle={cycle}
          toScale={effectiveScale}
        />
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
            <span className="text-[28px] text-neutral-400 line-through font-bold tracking-tight">
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
            <ScalingSlider
              value={scale}
              onChange={onScaleChange}
              ariaLabel={`${plan.name} credit multiplier`}
              tickFormat={(s) => fmtNumber(computeCredits(planId, s, cycle))}
            />
          </div>
        )}
        {isFixedPrice && (
          <div className="mt-auto pt-2">
            <div
              className="flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[13px] font-medium text-neutral-700 border border-white/70 shadow-sm backdrop-blur-md whitespace-nowrap"
              style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.55) 100%)' }}
            >
              <span aria-hidden className="text-emerald-600 font-bold leading-none">✓</span>
              Fixed amount of {fmtNumber(credits)} credits/{isYearly ? 'year' : 'mo'}
            </div>
          </div>
        )}
      </div>

      {isVolumeUpgrade && currentSub ? (
        <VolumeUpgradeCTA
          fromCredits={computeCredits(planId, currentSub.currentScale, cycle)}
          toCredits={credits}
          fromPrice={computePrice(planId, currentSub.currentScale, cycle).displayPrice}
          toPrice={price.displayPrice}
          isYearly={isYearly}
          onClick={handleUpgradeClick}
        />
      ) : (
        <RoleAwareCTA
          variant={ctaVariant}
          planId={planId}
          planName={plan.name}
          fallbackCta={plan.cta}
          onUpgradeClick={handleUpgradeClick}
          onDowngradeClick={handleDowngradeClick}
        />
      )}

      <div className={`text-center text-xs text-neutral-500 ${ROW.save}`}>
        {isYearly && !isCurrent && (
          <>
            <span className="font-semibold text-ink">Save {fmtMoney(savings)}</span> compared to monthly
          </>
        )}
      </div>

      <FeatureMatrix planId={planId} />

      {/* Upgrade preview modal */}
      {modalFrom && (
        <UpgradePreviewModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          from={modalFrom}
          to={planId}
          variant={modalVariant}
          fromScale={currentSub?.currentScale ?? 1}
          toScale={effectiveScale}
          cycle={cycle}
        />
      )}

      {/* Downgrade churn modal */}
      {modalFrom && (
        <DowngradeChurnModal
          open={churnOpen}
          onClose={() => setChurnOpen(false)}
          from={modalFrom}
          to={planId}
        />
      )}
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
  onUpgradeClick: () => void;
  onDowngradeClick: () => void;
}

function RoleAwareCTA({ variant, planId, planName, fallbackCta, onUpgradeClick, onDowngradeClick }: RoleAwareCTAProps) {
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
    return (
      <Button
        variant={ctaVariants[planId]}
        onClick={e => { e.preventDefault(); onUpgradeClick(); }}
      >
        Upgrade to {planName}
      </Button>
    );
  }
  if (variant === 'downgrade') {
    // 文案用 plan 默认 CTA（Get Starter / Get Pro 等），不显式说"Downgrade"
    // 点击仍触发 churn modal 拦截
    return (
      <button
        type="button"
        onClick={onDowngradeClick}
        className="block w-full text-center px-4 py-3 rounded-[10px] font-semibold text-sm border border-neutral-300 text-neutral-600 bg-white hover:bg-neutral-50 transition-colors"
      >
        {fallbackCta}
      </button>
    );
  }
  // default — free user
  return <Button variant={ctaVariants[planId]}>{fallbackCta}</Button>;
}

/** Ultra 当前用户拖滑块到更高倍数时的 CTA — 紫色 active + delta 小字 */
interface VolumeUpgradeCTAProps {
  fromCredits: number;
  toCredits: number;
  fromPrice: number;
  toPrice: number;
  isYearly: boolean;
  onClick: () => void;
}

function VolumeUpgradeCTA({ fromCredits, toCredits, fromPrice, toPrice, isYearly, onClick }: VolumeUpgradeCTAProps) {
  const creditsDelta = toCredits - fromCredits;
  const priceDelta = toPrice - fromPrice;
  return (
    <div className="flex flex-col gap-1">
      <Button
        variant="secondary"
        onClick={e => { e.preventDefault(); onClick(); }}
      >
        Update Subscription
      </Button>
      <div className="text-center text-[11px] text-neutral-500">
        +{fmtNumber(creditsDelta)} credits/{isYearly ? 'yr' : 'mo'} · +{fmtMoney(priceDelta)}/mo
      </div>
    </div>
  );
}

/** 升级差量 callout — 显示在高 tier 卡顶部，让现订阅用户看清"升级多得到什么" */
interface UpgradeDeltaCalloutProps {
  from: PaidPlanId;
  to: PaidPlanId;
  /** 决定 callout 配色，跟 plan tier 主色保持一致 */
  tone: PaidPlanId;
  /** 页面当前选择的 cycle，决定 credits 显示单位（per month / per year）*/
  cycle: BillingCycle;
  /** 目标 plan 的 scale（仅 Ultra 滑块可变；其他固定 1）*/
  toScale: Scale;
}

// 每个 tier 的 callout 配色（背景 / 边框 / 标题字 / 正文字 / 副标字 / + 号字）
const CALLOUT_THEME: Record<PaidPlanId, {
  bg: string; border: string; title: string; body: string; sub: string; plus: string;
}> = {
  starter: {
    bg: 'bg-neutral-100',
    border: 'border-neutral-300',
    title: 'text-neutral-700',
    body: 'text-neutral-900',
    sub: 'text-neutral-500',
    plus: 'text-neutral-600',
  },
  pro: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    title: 'text-orange-700',
    body: 'text-orange-950',
    sub: 'text-orange-700/70',
    plus: 'text-orange-600',
  },
  ultra: {
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    title: 'text-violet-700',
    body: 'text-violet-900',
    sub: 'text-violet-700/70',
    plus: 'text-violet-600',
  },
};

function UpgradeDeltaCallout({ from, to, tone, cycle, toScale }: UpgradeDeltaCalloutProps) {
  const delta = UPGRADE_DELTAS[`${from}-${to}`];
  if (!delta) return null;
  // 跟随 page cycle + 目标 scale 动态计算，与下方 credits chip 显示口径一致
  // source 用 1x（Starter/Pro 固定 1x；不是 Ultra 不会进这个 callout）
  const targetCredits = computeCredits(to, toScale, cycle);
  const sourceCredits = computeCredits(from, 1, cycle);
  const creditsDelta = targetCredits - sourceCredits;
  const period = cycle === 'yearly' ? 'year' : 'month';
  const t = CALLOUT_THEME[tone];
  return (
    <div className={`rounded-lg p-3 ${t.bg}`}>
      <div className={`text-[11px] font-bold uppercase tracking-wider ${t.title} mb-1.5 flex items-center gap-1`}>
        <span aria-hidden>✨</span>
        Upgrade unlocks
      </div>
      <ul className={`space-y-0.5 text-[12px] ${t.body} leading-snug`}>
        <li className="flex items-start gap-1.5">
          <span className={`${t.plus} font-bold leading-none mt-0.5`}>+</span>
          <span>
            <b>{fmtNumber(targetCredits)} credits</b> per {period}{' '}
            <span className={t.sub}>({fmtNumber(creditsDelta)} more than your current plan)</span>
          </span>
        </li>
        {delta.unlocks.map(u => (
          <li key={u} className="flex items-start gap-1.5">
            <span className={`${t.plus} font-bold leading-none mt-0.5`}>+</span>
            <span>{u}</span>
          </li>
        ))}
      </ul>
    </div>
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

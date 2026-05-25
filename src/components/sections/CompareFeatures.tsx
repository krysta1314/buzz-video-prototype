import {
  MODELS,
  PAID_PLANS,
  PAID_PLAN_ORDER,
  type ModelCategory,
  type PaidPlanId,
} from '@/config/pricing';
import { BillingToggle } from '@/components/ui/BillingToggle';
import { Button } from '@/components/ui/Button';
import { ScalingSlider } from '@/components/ui/ScalingSlider';
import { computeCredits, computeGenerations, computePrice } from '@/lib/compute';
import { fmtMoney, fmtNumber } from '@/lib/format';
import type { RegionState } from '@/hooks/usePricingState';

interface Props {
  region: RegionState;
}

const FREE_CREDITS = 500;

// 模型营销分类标签：Premium Cinematic 高端电影级，其余默认 Standard 日常素材
const PREMIUM_CINEMATIC_MODEL_IDS = new Set<string>([
  'nano-banana',
  'nano-banana-2',
  'nano-banana-pro',
  'gpt-image-2',
  'seedance-2',
  'seedance-2-fast',
  'kling-3',
]);

export function CompareFeatures({ region }: Props) {
  const { cycle, scales, setCycle, setScale } = region;
  const creditsFor = (planId: PaidPlanId) => {
    // Starter and Pro are fixed-price — always 1x regardless of stored state.
    const effectiveScale = (planId === 'starter' || planId === 'pro') ? 1 : scales[planId];
    return computeCredits(planId, effectiveScale, cycle);
  };
  const planColTint = (_planId: PaidPlanId) => '';

  const imageModels = MODELS.filter(m => m.category === 'image');
  const videoModels = MODELS.filter(m => m.category === 'video');

  return (
    <section className="mt-20" id="compare">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-[28px] font-bold tracking-tight">Compare all features and plans</h2>
        <p className="mt-2 text-sm text-neutral-500">
          Switch billing cycle or scale up Ultra&rsquo;s credits to see how many assets each plan delivers.
        </p>
        <div className="mt-5 inline-flex">
          <BillingToggle value={cycle} onChange={setCycle} ariaLabel="Compare features billing cycle" />
        </div>
      </div>

      <div id="compare-table" className="border border-neutral-200 rounded-2xl">
        <table className="w-full border-collapse min-w-[880px] text-[13px]">
          <thead>
            <tr>
              <th className="text-left p-4 bg-neutral-50 border-b border-neutral-200 w-[200px] sticky top-0 z-20">Plan</th>
              <ColHeader planId="free" />
              {PAID_PLAN_ORDER.map(planId => (
                <PaidColHeader
                  key={planId}
                  planId={planId}
                  cycle={cycle}
                  scale={scales[planId]}
                  onScaleChange={(s) => setScale(planId, s)}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            <GroupRow label="Credits" />
            <tr>
              <td className="p-4 border-b border-neutral-200">
                <div className="font-medium">Total Credits</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  {cycle === 'monthly' ? 'Per month' : 'Per year, delivered upfront'}
                </div>
              </td>
              <td className="p-4 border-b border-neutral-200">
                {fmtNumber(FREE_CREDITS)} <span className="text-neutral-500">credits (one-time)</span>
              </td>
              {PAID_PLAN_ORDER.map(planId => (
                <td key={planId} className={`p-4 border-b border-neutral-200 ${planColTint(planId)}`}>
                  <b>{fmtNumber(creditsFor(planId))}</b>{' '}
                  <span className="text-neutral-500">credits / {cycle === 'monthly' ? 'mo' : 'yr'}</span>
                </td>
              ))}
            </tr>

            <ModelGroup
              category="image"
              models={imageModels}
              creditsFor={creditsFor}
              planColTint={planColTint}
            />
            <ModelGroup
              category="video"
              models={videoModels}
              creditsFor={creditsFor}
              planColTint={planColTint}
            />

            <GroupRow label="Features" />
            <FeatureRow label="Marketing Agent"        values={['✓','✓','✓','✓']} planColTint={planColTint} />
            <FeatureRow label="Image Generation"       values={['✓','✓','✓','✓']} planColTint={planColTint} />
            <FeatureRow label="Video Generation"       values={['✗','✓','✓','✓']} planColTint={planColTint} />
            <FeatureRow label={<>Long Video Generation <span className="text-neutral-500 text-[11px]">(Early Access)</span></>} values={['✗','✗','✗','✓']} planColTint={planColTint} />
            <FeatureRow label="Watermark-free Videos"  values={['—','✓','✓','✓']} planColTint={planColTint} />
            <FeatureRow label="Technical Support"       values={['✗','✗','✓','✓']} planColTint={planColTint} />

            <GroupRow label="AI Avatars & Customization" />
            <FeatureRow label="AI Avatars"             values={['1','Unlimited','Unlimited','Unlimited']} planColTint={planColTint} />
            <FeatureRow label="Character Customization (Seedance 2.0)" values={['✗','Unlimited','Unlimited','Unlimited']} planColTint={planColTint} />
          </tbody>
        </table>
      </div>

    </section>
  );
}

function ColHeader({ planId }: { planId: 'free' }) {
  return (
    <th className="text-left p-4 bg-neutral-50 border-b border-neutral-200 min-w-[180px] align-top sticky top-0 z-20">
      <div className="font-bold text-[15px]">Free</div>
      <div className="text-[20px] font-bold tracking-tight mt-2">$0</div>
      <div className="text-[11px] text-neutral-500 mt-0.5">{fmtNumber(FREE_CREDITS)} credits (one-time)</div>
      {/* placeholder for slider height parity with Ultra column */}
      <div className="invisible mt-2.5 h-[58px]" aria-hidden />
      {/* CTA placeholder so Free column matches paid columns' button height (Free has no Compare-page CTA) */}
      <div className="invisible mt-3 h-[44px]" aria-hidden />
      <span className="sr-only">{planId}</span>
    </th>
  );
}

interface PaidColHeaderProps {
  planId: PaidPlanId;
  cycle: 'monthly' | 'yearly';
  scale: import('@/config/pricing').Scale;
  onScaleChange: (s: import('@/config/pricing').Scale) => void;
}

function PaidColHeader({ planId, cycle, scale, onScaleChange }: PaidColHeaderProps) {
  const plan = PAID_PLANS[planId];
  // Starter and Pro are fixed-price — only Ultra has the slider.
  const isFixedPrice = planId === 'starter' || planId === 'pro';
  const effectiveScale = isFixedPrice ? (1 as import('@/config/pricing').Scale) : scale;
  const price = computePrice(planId, effectiveScale, cycle);
  const isYearly = cycle === 'yearly';
  const tint = '';
  // 按钮色匹配 Plan Cards 区配色（Starter dark / Pro accent / Ultra secondary）
  const ctaVariant = planId === 'starter' ? 'dark' : planId === 'pro' ? 'accent' : 'secondary';
  return (
    <th className={`text-left p-4 bg-neutral-50 border-b border-neutral-200 min-w-[180px] align-top sticky top-0 z-20 ${tint}`}>
      <div className="font-bold text-[15px]">
        {plan.name}
        {plan.badge && (
          <span
            className={`ml-1.5 align-middle text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              plan.badge.variant === 'popular'
                ? 'bg-accent text-white'
                : 'border border-secondary text-secondary'
            }`}
          >
            {plan.badge.label}
          </span>
        )}
      </div>
      <div className="mt-2">
        {isYearly && (
          <span className="text-[12px] text-neutral-400 line-through mr-1">
            {fmtMoney(price.monthlyPrice)}
          </span>
        )}
        <span className="text-[20px] font-bold tracking-tight">
          {fmtMoney(price.displayPrice)}
        </span>
        <span className="text-[11px] text-neutral-500 ml-0.5">/mo</span>
      </div>
      <div className="text-[11px] text-neutral-500 mt-0.5 min-h-[14px]">
        {isYearly ? `${fmtMoney(price.annualTotal)} billed annually` : ' '}
      </div>
      {!isFixedPrice ? (
        <div className="mt-2.5">
          <ScalingSlider
            value={scale}
            onChange={onScaleChange}
            ariaLabel={`${plan.name} compare column credit multiplier`}
            tickFormat={(s) => fmtNumber(computeCredits(planId, s, cycle))}
          />
        </div>
      ) : (
        // Starter / Pro: slider placeholder so CTA aligns with Ultra column
        <div className="invisible mt-2.5 h-[58px]" aria-hidden />
      )}
      <div className="mt-3">
        {/* 占位 CTA — 暂时点击无反应，未来接 Stripe Checkout 直跳 */}
        <Button variant={ctaVariant} onClick={e => e.preventDefault()}>
          {plan.cta}
        </Button>
      </div>
    </th>
  );
}

function ModelTag({ isPremium }: { isPremium: boolean }) {
  if (isPremium) {
    return (
      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-violet-50 text-violet-700 whitespace-nowrap">
        Premium Cinematic Assets
      </span>
    );
  }
  return (
    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 whitespace-nowrap">
      Standard Assets
    </span>
  );
}

function GroupRow({ label }: { label: string }) {
  return (
    <tr>
      <td
        colSpan={5}
        className="bg-neutral-50 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-600"
      >
        {label}
      </td>
    </tr>
  );
}

function FeatureRow({
  label,
  values,
  planColTint,
}: {
  label: React.ReactNode;
  values: [string, string, string, string];
  planColTint: (p: PaidPlanId) => string;
}) {
  const [free, starter, pro, ultra] = values;
  return (
    <tr>
      <td className="p-4 border-b border-neutral-200">{label}</td>
      <td className="p-4 border-b border-neutral-200">{free}</td>
      <td className={`p-4 border-b border-neutral-200 ${planColTint('starter')}`}>{starter}</td>
      <td className={`p-4 border-b border-neutral-200 ${planColTint('pro')}`}>{pro}</td>
      <td className={`p-4 border-b border-neutral-200 ${planColTint('ultra')}`}>{ultra}</td>
    </tr>
  );
}

interface ModelGroupProps {
  category: ModelCategory;
  models: typeof MODELS[number][];
  creditsFor: (p: PaidPlanId) => number;
  planColTint: (p: PaidPlanId) => string;
}

function ModelGroup({ category, models, creditsFor, planColTint }: ModelGroupProps) {
  const label = category === 'image' ? 'Image Models' : 'Video Models';
  return (
    <>
      <GroupRow label={label} />
      {models.map(m => (
        <tr key={m.id}>
          <td className="p-4 border-b border-neutral-200">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-ink">{m.name}</span>
              <ModelTag isPremium={PREMIUM_CINEMATIC_MODEL_IDS.has(m.id)} />
            </div>
            <div className="text-[11px] text-neutral-500 mt-0.5">
              {m.sku} · {fmtNumber(m.pricePerUnit)} credits/{m.unitLabel}
            </div>
          </td>
          {(['free','starter','pro','ultra'] as const).map(planId => {
            const tint = planId === 'pro' ? planColTint('pro') : planId === 'starter' ? planColTint('starter') : planId === 'ultra' ? planColTint('ultra') : '';
            if (planId === 'free') {
              const count = m.freeAccess ? Math.floor(FREE_CREDITS / m.pricePerUnit) : null;
              return (
                <td key={planId} className={`p-4 border-b border-neutral-200 ${tint}`}>
                  {count === null ? '✗' : `${fmtNumber(count)} ${m.unitLabel}s`}
                </td>
              );
            }
            const count = computeGenerations(creditsFor(planId), m.id);
            return (
              <td key={planId} className={`p-4 border-b border-neutral-200 ${tint}`}>
                {fmtNumber(count)} {m.unitLabel}s
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
}

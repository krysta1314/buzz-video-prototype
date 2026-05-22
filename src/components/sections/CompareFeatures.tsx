import {
  ACCESS_POLICY,
  MODELS,
  PAID_PLANS,
  PAID_PLAN_ORDER,
  type ModelCategory,
  type PaidPlanId,
} from '@/config/pricing';
import { BillingToggle } from '@/components/ui/BillingToggle';
import { ScalingSlider } from '@/components/ui/ScalingSlider';
import { computeCredits, computeGenerations, computePrice } from '@/lib/compute';
import { fmtMoney, fmtNumber } from '@/lib/format';
import type { RegionState } from '@/hooks/usePricingState';

interface Props {
  region: RegionState;
}

const FREE_CREDITS = 500;

export function CompareFeatures({ region }: Props) {
  const { cycle, scales, setCycle, setScale } = region;
  const creditsFor = (planId: PaidPlanId) => {
    // Starter is fixed-price — always 1x regardless of stored state.
    const effectiveScale = planId === 'starter' ? 1 : scales[planId];
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
          Adjust each column&rsquo;s credits independently to see how many images or videos you can generate.
        </p>
        <div className="mt-5 inline-flex">
          <BillingToggle value={cycle} onChange={setCycle} ariaLabel="Compare features billing cycle" />
        </div>
      </div>

      <div className="overflow-x-auto border border-neutral-200 rounded-2xl">
        <table className="w-full border-collapse min-w-[880px] text-[13px]">
          <thead>
            <tr>
              <th className="text-left p-4 bg-neutral-50 border-b border-neutral-200 w-[200px]">Plan</th>
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
            <FeatureRow label="Watermark-free Videos"  values={['✗','✓','✓','✓']} planColTint={planColTint} />

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
    <th className="text-left p-4 bg-neutral-50 border-b border-neutral-200 min-w-[180px] align-top">
      <div className="font-bold text-[15px]">Free</div>
      <div className="text-[20px] font-bold tracking-tight mt-2">$0</div>
      <div className="text-[11px] text-neutral-500 mt-0.5">&nbsp;</div>
      {/* placeholder for slider height parity */}
      <div className="invisible mt-2.5 h-[58px]" aria-hidden />
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
  // Starter is fixed-price — no slider, always 1x.
  const isFixedPrice = planId === 'starter';
  const effectiveScale = isFixedPrice ? (1 as import('@/config/pricing').Scale) : scale;
  const price = computePrice(planId, effectiveScale, cycle);
  const isYearly = cycle === 'yearly';
  const tint = '';
  return (
    <th className={`text-left p-4 bg-neutral-50 border-b border-neutral-200 min-w-[180px] align-top ${tint}`}>
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
      {!isFixedPrice && (
        <div className="mt-2.5">
          <ScalingSlider
            value={scale}
            onChange={onScaleChange}
            ariaLabel={`${plan.name} compare column credit multiplier`}
          />
        </div>
      )}
    </th>
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
  const label = category === 'image' ? 'Access Models (Image)' : 'Access Models (Video)';
  const policy = ACCESS_POLICY[category];
  return (
    <>
      <GroupRow label={label} />
      <tr>
        <td className="p-4 border-b border-neutral-200">
          <div className="font-medium">Access Policy</div>
          <div className="text-[11px] text-neutral-500 mt-0.5">Premium model availability per billing cycle</div>
        </td>
        <td className="p-4 border-b border-neutral-200">{policy.free}</td>
        <td className={`p-4 border-b border-neutral-200 ${planColTint('starter')}`}>{policy.starter}</td>
        <td className={`p-4 border-b border-neutral-200 ${planColTint('pro')}`}>{policy.pro}</td>
        <td className={`p-4 border-b border-neutral-200 ${planColTint('ultra')}`}>{policy.ultra}</td>
      </tr>
      {models.map(m => (
        <tr key={m.id}>
          <td className="p-4 border-b border-neutral-200">
            <div className="font-medium text-ink">{m.name}</div>
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

import { useEffect, useState, type ReactNode } from 'react';

/**
 * Credits 预警 UI Mock Demo v2
 * 完全独立于 pricing state(不读 region / role / scale / FAKE_SUBSCRIPTION)。
 *
 * 触发改成「剩余 credits」而非百分比 — 适配不同 plan 不同 credits 额度。
 * 加入 cycle 维度(Free oneTime / Starter|Pro|Ultra monthly | yearly)— 共 7 个有效组合 × 3 level。
 */

type DemoRole = 'free' | 'starter' | 'pro' | 'ultra';
type DemoCycle = 'oneTime' | 'monthly' | 'yearly';
type DemoLevel = 'low' | 'urgent' | 'depleted';
type DemoScale = 1 | 2 | 4; // 仅 Ultra 用,其他 role 一律 1

interface ThresholdConfig {
  /** 触发条件:剩余 credits ≤ remainingAtTrigger 时显示该 level */
  remainingAtTrigger: number;
  title: string;
  value: string;
}

interface CycleConfig {
  total: number;
  renewalCopy: string;
  /** 升级目标的可生成数量(随 cycle 改 — monthly 用 /month,yearly 用 /year)*/
  deliverables: string;
  thresholds: Record<DemoLevel, ThresholdConfig>;
  /** 年付选项文案,null = 不显示。仅 monthly cycle 推年付 cross-sell */
  annualOffer: string | null;
}

interface RoleConfig {
  label: string;
  upgradeLabel: string;
  upgrade: {
    targetName: string;
    anchorPrice: string;
    unlocks: { icon: string; label: string }[];
  };
  cycles: Partial<Record<DemoCycle, CycleConfig>>;
}

const ROLES: Record<DemoRole, RoleConfig> = {
  // ────────── FREE(只有 oneTime)──────────
  free: {
    label: 'Free',
    upgradeLabel: 'Upgrade to Starter →',
    upgrade: {
      targetName: 'Starter',
      anchorPrice: 'just $14/mo',
      unlocks: [
        { icon: '🚫', label: 'No watermarks' },
        { icon: '🎬', label: 'All video models' },
        { icon: '👥', label: 'Unlimited AI Avatars' },
      ],
    },
    cycles: {
      oneTime: {
        total: 500,
        renewalCopy: "Free credits don't refill",
        deliverables: 'Starter gives ≈ 633 social images or 13 HD video ads / month',
        annualOffer: 'Or upgrade annually and get 3.6 months free ($14/mo)',
        thresholds: {
          low: {
            remainingAtTrigger: 250,
            title: 'Half spent',
            value: 'Free comes with 500 one-time credits — no refill. Subscribe to Starter for monthly refreshes.',
          },
          urgent: {
            remainingAtTrigger: 100,
            title: 'Only 100 credits left',
            value: 'Subscribe to keep creating — Starter starts at just $14/mo with 1,900 fresh credits every month.',
          },
          depleted: {
            remainingAtTrigger: 0,
            title: 'Free credits used up',
            value: 'Starter starts at just $14/mo and drops 1,900 fresh credits into your account instantly.',
          },
        },
      },
    },
  },

  // ────────── STARTER(monthly + yearly)──────────
  starter: {
    label: 'Starter',
    upgradeLabel: 'Upgrade to Pro →',
    upgrade: {
      targetName: 'Pro',
      anchorPrice: 'just $35/mo',
      unlocks: [
        { icon: '🎬', label: 'Seedance 2.0 unlocked' },
        { icon: '💬', label: 'Technical Support' },
        { icon: '📦', label: '+3,000 credits/mo' },
      ],
    },
    cycles: {
      monthly: {
        total: 1900,
        renewalCopy: 'Renews in 14 days',
        deliverables: 'Pro gives ≈ 1,633 social images or 18 Seedance 2.0 videos / month',
        annualOffer: 'Or upgrade annually and get 3.6 months free ($35/mo)',
        thresholds: {
          low: {
            remainingAtTrigger: 950,
            title: 'Halfway through this month',
            value: 'Pro starts at just $35/mo with 4,900 credits + Seedance 2.0 — about 2.5× your current Starter allowance.',
          },
          urgent: {
            remainingAtTrigger: 380,
            title: 'Only 380 credits left this month',
            value: 'Renews in 14 days, or upgrade to Pro for 4,900 fresh credits + Seedance 2.0 immediately.',
          },
          depleted: {
            remainingAtTrigger: 0,
            title: "This month's credits used up",
            value: 'Wait 14 days for renewal, or upgrade to Pro for instant 4,900 credits + Seedance 2.0.',
          },
        },
      },
      yearly: {
        total: 22800,
        renewalCopy: 'Renews in 6 months',
        deliverables: 'Pro yearly gives ≈ 19,600 social images or 226 Seedance 2.0 videos / year',
        annualOffer: null,
        thresholds: {
          low: {
            remainingAtTrigger: 11400,
            title: 'Halfway through your annual credits',
            value: "You've used 50% of 22,800 — check your pace against the year. Pro yearly gives you 58,800 credits and unlocks Seedance 2.0.",
          },
          urgent: {
            remainingAtTrigger: 4560,
            title: 'Only 4,560 credits left this year',
            value: 'Annual allowance running low. Upgrade to Pro for immediate +36,000 credits and Seedance 2.0.',
          },
          depleted: {
            remainingAtTrigger: 0,
            title: 'Annual credits used up',
            value: "Waiting ~6 months for renewal isn't realistic — upgrade to Pro for instant 58,800 fresh credits + Seedance 2.0.",
          },
        },
      },
    },
  },

  // ────────── PRO(monthly + yearly)──────────
  pro: {
    label: 'Pro',
    upgradeLabel: 'Upgrade to Ultra →',
    upgrade: {
      targetName: 'Ultra',
      anchorPrice: 'just $63/mo',
      unlocks: [
        { icon: '🎞', label: 'Long Video Early Access' },
        { icon: '⚡', label: 'Priority Processing' },
        { icon: '📦', label: '+4,000 credits/mo' },
      ],
    },
    cycles: {
      monthly: {
        total: 4900,
        renewalCopy: 'Renews in 18 days',
        deliverables: 'Ultra gives ≈ 2,966 social images or 34 Seedance 2.0 videos / month',
        annualOffer: 'Or upgrade annually and get 3.6 months free ($63/mo)',
        thresholds: {
          low: {
            remainingAtTrigger: 2450,
            title: 'Halfway through this month',
            value: 'Ultra starts at just $63/mo with 8,900 credits, Long Video Early Access, and Priority processing.',
          },
          urgent: {
            remainingAtTrigger: 980,
            title: 'Only 980 credits left this month',
            value: 'Renews in 18 days, or upgrade to Ultra for 8,900 fresh credits + Long Video immediately.',
          },
          depleted: {
            remainingAtTrigger: 0,
            title: "This month's credits used up",
            value: 'Wait 18 days for renewal, or upgrade to Ultra for instant 8,900 credits + Long Video Early Access.',
          },
        },
      },
      yearly: {
        total: 58800,
        renewalCopy: 'Renews in 7 months',
        deliverables: 'Ultra yearly gives ≈ 35,600 social images or 410 Seedance 2.0 videos / year',
        annualOffer: null,
        thresholds: {
          low: {
            remainingAtTrigger: 29400,
            title: 'Halfway through your annual credits',
            value: "You've used 50% of 58,800 — check your pace against the year. Ultra yearly gives 106,800 credits + Long Video Early Access.",
          },
          urgent: {
            remainingAtTrigger: 11760,
            title: 'Only 11,760 credits left this year',
            value: 'Annual allowance running low. Upgrade to Ultra for immediate +48,000 credits + Long Video.',
          },
          depleted: {
            remainingAtTrigger: 0,
            title: 'Annual credits used up',
            value: "Waiting ~7 months for renewal isn't realistic — upgrade to Ultra for instant 106,800 credits + Long Video Early Access.",
          },
        },
      },
    },
  },

  // ────────── ULTRA(monthly + yearly,升级目标 = Ultra 2×)──────────
  ultra: {
    label: 'Ultra',
    upgradeLabel: 'Scale up Ultra →',
    upgrade: {
      targetName: 'Ultra 2×',
      anchorPrice: '$119/mo (yearly equiv)',
      unlocks: [
        { icon: '📦', label: '+8,900 credits/mo (2× total)' },
        { icon: '💰', label: '33% bulk discount per credit' },
        { icon: '🚀', label: 'Same Ultra features, more volume' },
      ],
    },
    cycles: {
      monthly: {
        total: 8900,
        renewalCopy: 'Renews in 22 days',
        deliverables: '2× gives ≈ 5,933 social images or 68 Seedance 2.0 videos / month',
        annualOffer: 'Or upgrade annually and get 3.6 months free ($63/mo at 1×)',
        thresholds: {
          low: {
            remainingAtTrigger: 4450,
            title: 'Halfway through this month',
            value: 'Scale Ultra to 2× for +8,900 credits with a 33% bulk discount.',
          },
          urgent: {
            remainingAtTrigger: 1780,
            title: 'Only 1,780 credits left this month',
            value: 'Scale Ultra to 2× now — get +8,900 credits at 33% off per credit, or wait 22 days for renewal.',
          },
          depleted: {
            remainingAtTrigger: 0,
            title: "This month's credits used up",
            value: 'Wait 22 days for renewal, scale to 2× / 4×, or talk to us about Enterprise capacity.',
          },
        },
      },
      yearly: {
        total: 106800,
        renewalCopy: 'Renews in 8 months',
        deliverables: '2× yearly gives ≈ 71,200 social images or 821 Seedance 2.0 videos / year',
        annualOffer: null,
        thresholds: {
          low: {
            remainingAtTrigger: 53400,
            title: 'Halfway through your annual credits',
            value: "You've used 50% of 106,800 — check your pace against the year. Scale to 2× for an extra 106,800/year at 33% off.",
          },
          urgent: {
            remainingAtTrigger: 21360,
            title: 'Only 21,360 credits left this year',
            value: 'Annual allowance running low. Scale Ultra to 2× / 4× for more, or contact Enterprise for custom volume.',
          },
          depleted: {
            remainingAtTrigger: 0,
            title: 'Annual credits used up',
            value: "Waiting ~8 months for renewal isn't realistic — scale to 2× / 4× now, or contact Enterprise for custom capacity.",
          },
        },
      },
    },
  },
};

interface LevelTheme {
  icon: ReactNode;
  accentSoft: string;
  cardBg: string;
  cardBorder: string;
  titleColor: string;
  subtitleColor: string;
  progressTrack: string;
  progressFill: string;
  chipBg: string;
  chipText: string;
  cardShadow: string;
  pulse: boolean;
}

const LEVELS: Record<DemoLevel, LevelTheme> = {
  low: {
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4" />
        <circle cx="12" cy="16" r="0.5" fill="currentColor" />
      </svg>
    ),
    accentSoft: 'bg-sky-100 text-sky-600',
    cardBg: 'bg-gradient-to-br from-white to-sky-50/60',
    cardBorder: 'border-sky-200/70',
    titleColor: 'text-sky-900',
    subtitleColor: 'text-sky-600/80',
    progressTrack: 'bg-sky-100',
    progressFill: 'bg-gradient-to-r from-sky-400 to-sky-600',
    chipBg: 'bg-sky-100',
    chipText: 'text-sky-700',
    cardShadow: 'shadow-[0_10px_40px_-12px_rgba(14,165,233,0.35)]',
    pulse: false,
  },
  urgent: {
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <circle cx="12" cy="17" r="0.5" fill="currentColor" />
      </svg>
    ),
    accentSoft: 'bg-amber-100 text-amber-600',
    cardBg: 'bg-gradient-to-br from-white to-amber-50/70',
    cardBorder: 'border-amber-200/70',
    titleColor: 'text-amber-900',
    subtitleColor: 'text-amber-700/80',
    progressTrack: 'bg-amber-100',
    progressFill: 'bg-gradient-to-r from-amber-400 to-amber-600',
    chipBg: 'bg-amber-100',
    chipText: 'text-amber-700',
    cardShadow: 'shadow-[0_10px_40px_-12px_rgba(245,158,11,0.4)]',
    pulse: false,
  },
  depleted: {
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" stroke="none" />
      </svg>
    ),
    accentSoft: 'bg-rose-100 text-rose-600',
    cardBg: 'bg-gradient-to-br from-white to-rose-50/80',
    cardBorder: 'border-rose-200/70',
    titleColor: 'text-rose-900',
    subtitleColor: 'text-rose-700/80',
    progressTrack: 'bg-rose-100',
    progressFill: 'bg-gradient-to-r from-rose-400 to-rose-600',
    chipBg: 'bg-rose-100',
    chipText: 'text-rose-700',
    cardShadow: 'shadow-[0_12px_45px_-12px_rgba(244,63,94,0.5)]',
    pulse: true,
  },
};

const ROLE_OPTIONS: DemoRole[] = ['free', 'starter', 'pro', 'ultra'];
const LEVEL_OPTIONS: DemoLevel[] = ['low', 'urgent', 'depleted'];
const LEVEL_LABEL: Record<DemoLevel, string> = { low: 'Low', urgent: 'Urgent', depleted: 'Depleted' };
const SCALE_OPTIONS: DemoScale[] = [1, 2, 4];

function fmtNumber(n: number) {
  return n.toLocaleString('en-US');
}

interface CreditsWarningDemoProps {
  open: boolean;
  onClose: () => void;
}

export function CreditsWarningDemo({ open, onClose }: CreditsWarningDemoProps) {
  const [role, setRole] = useState<DemoRole>('free');
  const [cycle, setCycle] = useState<DemoCycle>('oneTime'); // Free 默认 oneTime
  const [level, setLevel] = useState<DemoLevel>('low');
  const [scale, setScale] = useState<DemoScale>(1); // 仅 Ultra 用
  const [cardVisible, setCardVisible] = useState(true);

  // Free 强制 oneTime;切到 paid 自动转 monthly;切到非 Ultra 复位 scale=1
  const pickRole = (r: DemoRole) => {
    setRole(r);
    setCycle(r === 'free' ? 'oneTime' : 'monthly');
    if (r !== 'ultra') setScale(1);
    setCardVisible(true);
  };
  const pickCycle = (c: DemoCycle) => { setCycle(c); setCardVisible(true); };
  const pickLevel = (l: DemoLevel) => { setLevel(l); setCardVisible(true); };
  const pickScale = (s: DemoScale) => { setScale(s); setCardVisible(true); };

  useEffect(() => {
    if (open) setCardVisible(true);
  }, [open]);

  if (!open) return null;

  const roleCfg = ROLES[role];
  const cycleCfg = roleCfg.cycles[cycle];
  // 防御:如果 role/cycle 组合没配置(不应该发生),回退到第一个可用 cycle
  const safeCycleCfg = cycleCfg ?? Object.values(roleCfg.cycles)[0]!;
  const thresholdCfg = safeCycleCfg.thresholds[level];
  const theme = LEVELS[level];

  // Ultra 滑块倍数:total + 阈值线性放大;其他 role scale 恒等于 1
  const effectiveScale: DemoScale = role === 'ultra' ? scale : 1;
  const total = safeCycleCfg.total * effectiveScale;
  const remaining = thresholdCfg.remainingAtTrigger * effectiveScale;
  const usedCredits = total - remaining;
  const pct = Math.round((usedCredits / total) * 100);

  // Cycle picker 是否可用(Free 锁死)
  const availableCycles = Object.keys(roleCfg.cycles) as DemoCycle[];

  return (
    <div className="hidden md:flex fixed bottom-[220px] right-6 z-30 flex-col gap-3 items-end">
      {/* ─── Control Panel ─── */}
      <div
        className="w-[340px] rounded-2xl bg-white border border-neutral-200 shadow-2xl p-4"
        role="dialog"
        aria-label="Credits Warning Demo Control Panel"
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Demo</div>
            <h3 className="text-sm font-bold text-ink mt-0.5">Credits Warning Mock</h3>
          </div>
          <button
            type="button"
            aria-label="Close demo"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-500 text-lg leading-none"
          >
            ×
          </button>
        </div>

        <p className="text-[11px] text-neutral-500 mb-3 leading-relaxed">
          Pick role × cycle × level. Preview shows below.
        </p>

        {/* Role */}
        <div className="mb-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">Role</div>
          <div className="flex gap-1 p-1 bg-neutral-100 rounded-lg">
            {ROLE_OPTIONS.map(r => (
              <button
                key={r}
                type="button"
                onClick={() => pickRole(r)}
                className={
                  'flex-1 px-2 py-1.5 rounded-md text-[11px] font-semibold transition-colors ' +
                  (role === r ? 'bg-white text-ink shadow-sm' : 'text-neutral-500 hover:text-neutral-700')
                }
              >
                {ROLES[r].label}
              </button>
            ))}
          </div>
        </div>

        {/* Cycle */}
        <div className="mb-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">Cycle</div>
          <div className="flex gap-1 p-1 bg-neutral-100 rounded-lg">
            {role === 'free' ? (
              <button
                type="button"
                disabled
                className="flex-1 px-2 py-1.5 rounded-md text-[11px] font-semibold bg-white text-ink shadow-sm cursor-default"
              >
                One-time
              </button>
            ) : (
              (['monthly', 'yearly'] as DemoCycle[]).map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => pickCycle(c)}
                  disabled={!availableCycles.includes(c)}
                  className={
                    'flex-1 px-2 py-1.5 rounded-md text-[11px] font-semibold transition-colors capitalize ' +
                    (cycle === c ? 'bg-white text-ink shadow-sm' : 'text-neutral-500 hover:text-neutral-700')
                  }
                >
                  {c}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Scale — 仅 Ultra 显示 */}
        {role === 'ultra' && (
          <div className="mb-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">Ultra Scale</div>
            <div className="flex gap-1 p-1 bg-neutral-100 rounded-lg">
              {SCALE_OPTIONS.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => pickScale(s)}
                  className={
                    'flex-1 px-2 py-1.5 rounded-md text-[11px] font-semibold transition-colors ' +
                    (scale === s ? 'bg-white text-ink shadow-sm' : 'text-neutral-500 hover:text-neutral-700')
                  }
                >
                  {s}×
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Level — 每个 tab 显示对应剩余 credits(随 Ultra scale 联动)*/}
        <div className="mb-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">Trigger Level</div>
          <div className="flex gap-1 p-1 bg-neutral-100 rounded-lg">
            {LEVEL_OPTIONS.map(l => (
              <button
                key={l}
                type="button"
                onClick={() => pickLevel(l)}
                className={
                  'flex-1 px-1.5 py-1.5 rounded-md text-[10.5px] font-semibold transition-colors ' +
                  (level === l ? 'bg-white text-ink shadow-sm' : 'text-neutral-500 hover:text-neutral-700')
                }
              >
                <div>{LEVEL_LABEL[l]}</div>
                <div className="text-[9px] font-normal text-neutral-500 mt-0.5">
                  {fmtNumber(safeCycleCfg.thresholds[l].remainingAtTrigger * effectiveScale)} left
                </div>
              </button>
            ))}
          </div>
        </div>

        {!cardVisible && (
          <button
            type="button"
            onClick={() => setCardVisible(true)}
            className="w-full text-[11px] font-semibold text-ink underline mt-1"
          >
            Show preview card again
          </button>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-2 px-3 py-2 rounded-md border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
        >
          Close demo
        </button>
      </div>

      {/* ─── Preview Card ─── */}
      {cardVisible && (
        <div
          className={
            `w-[340px] rounded-2xl border overflow-hidden ` +
            `${theme.cardBg} ${theme.cardBorder} ${theme.cardShadow} ` +
            `backdrop-blur-sm`
          }
          role="status"
          aria-label={`${roleCfg.label} ${cycle} credits ${level} warning`}
        >
          <div className="p-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div
                  className={
                    `w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${theme.accentSoft} ` +
                    (theme.pulse ? 'animate-pulse' : '')
                  }
                  aria-hidden
                >
                  {theme.icon}
                </div>
                <div className="flex-1 min-w-0 mt-0.5">
                  <div className={`text-[10px] font-bold uppercase tracking-wider ${theme.subtitleColor}`}>
                    {roleCfg.label} plan
                    {role === 'ultra' && ` · ${scale}×`}
                    {' · '}
                    {cycle === 'oneTime' ? 'One-time' : cycle === 'monthly' ? 'Monthly' : 'Yearly'}
                  </div>
                  <h4 className={`text-[15px] font-bold leading-tight mt-0.5 ${theme.titleColor}`}>
                    {thresholdCfg.title}
                  </h4>
                </div>
              </div>
              <button
                type="button"
                aria-label="Dismiss"
                onClick={() => setCardVisible(false)}
                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-black/5 text-neutral-400 hover:text-neutral-600 text-lg leading-none flex-shrink-0 transition-colors"
              >
                ×
              </button>
            </div>

            {/* Progress section */}
            <div className="mb-4">
              <div className="flex items-baseline justify-between mb-1.5">
                <div className="text-[12px] text-neutral-600">
                  <span className="font-bold text-neutral-900 text-[15px]">{fmtNumber(remaining)}</span>
                  <span className="text-neutral-500 ml-1">credits left</span>
                  <span className="text-neutral-400 ml-1">/ {fmtNumber(total)}</span>
                </div>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${theme.chipBg} ${theme.chipText}`}
                >
                  {pct}% used
                </span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${theme.progressTrack} shadow-inner`}>
                <div
                  className={`h-full rounded-full ${theme.progressFill} shadow-sm transition-all duration-500 ease-out`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="mt-2 flex items-center gap-1 text-[11px] text-neutral-500">
                <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <polyline points="12 7 12 12 15 14" />
                </svg>
                <span>{safeCycleCfg.renewalCopy}</span>
              </div>
            </div>

            {/* Value copy + deliverables */}
            <div className="mb-3 rounded-lg bg-white/60 backdrop-blur-sm p-2.5 border border-white/80">
              <p className="text-[12px] text-neutral-700 leading-relaxed">
                {thresholdCfg.value}
              </p>
              <p className="mt-1.5 text-[11px] text-neutral-500 font-medium">
                {safeCycleCfg.deliverables}
              </p>
            </div>

            {/* Unlock tags */}
            <div className="mb-3 flex flex-wrap gap-1.5">
              {roleCfg.upgrade.unlocks.map(u => (
                <span
                  key={u.label}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/80 border border-neutral-200 text-[10.5px] font-medium text-neutral-700"
                >
                  <span aria-hidden>{u.icon}</span>
                  {u.label}
                </span>
              ))}
            </div>

            {/* Upgrade CTA — 品牌渐变 */}
            <button
              type="button"
              onClick={() => {
                // eslint-disable-next-line no-console
                console.log('[Demo] Upgrade clicked', { role, cycle, level });
              }}
              style={{
                background: 'linear-gradient(90deg, #FFA73C 0%, #FF5255 100%)',
                boxShadow: '0 6px 18px -4px rgba(255, 82, 85, 0.45)',
              }}
              className={
                `w-full px-4 py-2.5 rounded-xl text-white text-[13px] font-semibold ` +
                `transition-all hover:-translate-y-0.5 hover:brightness-105 ` +
                `inline-flex items-center justify-center gap-1.5`
              }
            >
              <span>{roleCfg.upgradeLabel.replace(' →', '')}</span>
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

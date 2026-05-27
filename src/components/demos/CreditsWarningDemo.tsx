import { useEffect, useState, type ReactNode } from 'react';

/**
 * Credits 预警 UI Mock Demo
 * 完全独立于 pricing state（不读 region / role / scale / FAKE_SUBSCRIPTION）。
 * 用户通过右下角浮动按钮触发,选择 role × threshold 组合预览卡片样式。
 * 只是 UI 设计 demo,不接真升级流程。
 */

type DemoRole = 'free' | 'starter' | 'pro' | 'ultra';
type DemoThreshold = 50 | 80 | 100;

interface RoleConfig {
  label: string;
  total: number;
  upgradeLabel: string;
  /** 周期倒计时上下文(显示在 progress bar 下方,小灰字)*/
  renewalCopy: string;
  /** 升级目标的营销信息(用于卡片内 deliverables / anchor price / unlocks / annual offer)*/
  upgrade: {
    /** 目标 plan 名称(e.g. "Starter") */
    targetName: string;
    /** 目标 plan monthly 起步价(e.g. "$14/mo") — 年付月均,push 心智锚定 */
    anchorPrice: string;
    /** 真实可生成数量(从抽象 credits 翻译成营销可感知的产出) */
    deliverables: string;
    /** 3 个核心 unlock(emoji + 短文案) */
    unlocks: { icon: string; label: string }[];
    /** 年付选项文案(下方文字链),null 表示不显示 */
    annualOffer: string | null;
  };
  // 三档文案
  copy: Record<DemoThreshold, { title: string; value: string }>;
}

const ROLES: Record<DemoRole, RoleConfig> = {
  free: {
    label: 'Free',
    total: 500,
    upgradeLabel: 'Upgrade to Starter →',
    renewalCopy: 'Free credits don’t refill',
    upgrade: {
      targetName: 'Starter',
      anchorPrice: 'just $14/mo',
      deliverables: '≈ 633 social images or 13 HD video ads / month',
      unlocks: [
        { icon: '🚫', label: 'No watermarks' },
        { icon: '🎬', label: 'All video models' },
        { icon: '👥', label: 'Unlimited AI Avatars' },
      ],
      annualOffer: 'Or upgrade annually and get 3.6 months free ($14/mo)',
    },
    copy: {
      50: {
        title: "You're halfway there",
        value: 'Subscribe to keep creating — Starter starts at just $14/mo and drops 1,900 fresh credits into your account every month.',
      },
      80: {
        title: 'Only 100 credits left',
        value: 'Subscribe to keep creating — Starter starts at just $14/mo and drops 1,900 fresh credits monthly.',
      },
      100: {
        title: 'Free credits used up',
        value: 'Starter starts at just $14/mo and drops 1,900 fresh credits into your account instantly.',
      },
    },
  },
  starter: {
    label: 'Starter',
    total: 1900,
    upgradeLabel: 'Upgrade to Pro →',
    renewalCopy: 'Renews in 14 days',
    upgrade: {
      targetName: 'Pro',
      anchorPrice: 'just $35/mo',
      deliverables: '≈ 1,633 social images or 18 Seedance 2.0 videos / month',
      unlocks: [
        { icon: '🎬', label: 'Seedance 2.0 unlocked' },
        { icon: '💬', label: 'Technical Support' },
        { icon: '📦', label: '+3,000 credits/mo' },
      ],
      annualOffer: 'Or upgrade annually and get 3.6 months free ($35/mo)',
    },
    copy: {
      50: {
        title: 'Halfway through this month',
        value: 'Pro starts at just $35/mo with 4,900 credits + Seedance 2.0 — about 2.5× your current Starter allowance.',
      },
      80: {
        title: 'Only 380 credits left',
        value: 'Pro starts at just $35/mo — get 4,900 fresh credits + Seedance 2.0 immediately.',
      },
      100: {
        title: 'Starter credits used up',
        value: 'Upgrade to Pro for just $35/mo and unlock 4,900 fresh credits + Seedance 2.0 instantly.',
      },
    },
  },
  pro: {
    label: 'Pro',
    total: 4900,
    upgradeLabel: 'Upgrade to Ultra →',
    renewalCopy: 'Renews in 18 days',
    upgrade: {
      targetName: 'Ultra',
      anchorPrice: 'just $63/mo',
      deliverables: '≈ 2,966 social images or 34 Seedance 2.0 videos / month',
      unlocks: [
        { icon: '🎞', label: 'Long Video Early Access' },
        { icon: '⚡', label: 'Priority Processing' },
        { icon: '📦', label: '+4,000 credits/mo' },
      ],
      annualOffer: 'Or upgrade annually and get 3.6 months free ($63/mo)',
    },
    copy: {
      50: {
        title: 'Halfway through this month',
        value: 'Ultra starts at just $63/mo with 8,900 credits, Long Video Early Access, and Priority processing.',
      },
      80: {
        title: 'Only 980 credits left',
        value: 'Ultra starts at just $63/mo — unlock 8,900 fresh credits + Long Video.',
      },
      100: {
        title: 'Pro credits used up',
        value: 'Upgrade to Ultra for just $63/mo and add 8,900 credits + Long Video Early Access instantly.',
      },
    },
  },
  ultra: {
    label: 'Ultra',
    total: 8900,
    upgradeLabel: 'Scale up Ultra →',
    renewalCopy: 'Renews in 22 days',
    upgrade: {
      targetName: 'Ultra 2×',
      anchorPrice: '$119/mo (yearly equiv)',
      deliverables: '≈ 5,933 social images or 68 Seedance 2.0 videos / month',
      unlocks: [
        { icon: '📦', label: '+8,900 credits/mo (2× total)' },
        { icon: '💰', label: '33% bulk discount per credit' },
        { icon: '🚀', label: 'Same Ultra features, more volume' },
      ],
      annualOffer: null, // Ultra 已经默认 yearly mock,不再二次推年付
    },
    copy: {
      50: {
        title: 'Halfway through this month',
        value: 'Scale Ultra to 2× for +8,900 credits with a 33% bulk discount.',
      },
      80: {
        title: 'Only 1,780 credits left',
        value: 'Scale Ultra to 2× now — get +8,900 credits at 33% off per credit.',
      },
      100: {
        title: 'Ultra credits used up',
        value: 'Scale to 2× / 4× for more, or talk to us about Enterprise capacity.',
      },
    },
  },
};

interface ThresholdTheme {
  icon: ReactNode;
  /** 图标圆背景 */
  accentSoft: string;   // bg-{color}-100 用于图标圆背景
  cardBg: string;       // 卡片主底,极浅渐变
  cardBorder: string;
  titleColor: string;
  subtitleColor: string;
  progressTrack: string;
  progressFill: string; // 渐变填充
  chipBg: string;       // 右侧 % chip
  chipText: string;
  cardShadow: string;   // 主题色 tinted shadow
  ctaBg: string;        // CTA 按钮主色
  ctaHover: string;
  pulse: boolean;       // 100% 时图标轻微 pulse
}

const THRESHOLDS: Record<DemoThreshold, ThresholdTheme> = {
  50: {
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
    ctaBg: 'bg-sky-600',
    ctaHover: 'hover:bg-sky-700',
    pulse: false,
  },
  80: {
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
    ctaBg: 'bg-amber-600',
    ctaHover: 'hover:bg-amber-700',
    pulse: false,
  },
  100: {
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
    ctaBg: 'bg-rose-600',
    ctaHover: 'hover:bg-rose-700',
    pulse: true,
  },
};

const ROLE_OPTIONS: DemoRole[] = ['free', 'starter', 'pro', 'ultra'];
const THRESHOLD_OPTIONS: DemoThreshold[] = [50, 80, 100];

function fmtNumber(n: number) {
  return n.toLocaleString('en-US');
}

interface CreditsWarningDemoProps {
  open: boolean;
  onClose: () => void;
}

export function CreditsWarningDemo({ open, onClose }: CreditsWarningDemoProps) {
  // 当前预览组合
  const [role, setRole] = useState<DemoRole>('free');
  const [threshold, setThreshold] = useState<DemoThreshold>(50);
  // card 是否被 × 关掉(独立于 demo 整体开关)
  const [cardVisible, setCardVisible] = useState(true);

  // 切换 role/threshold 时重置 card 可见性
  const pickRole = (r: DemoRole) => { setRole(r); setCardVisible(true); };
  const pickThreshold = (t: DemoThreshold) => { setThreshold(t); setCardVisible(true); };

  const handleCloseDemo = () => onClose();

  // demo 重新打开时,恢复 card 可见
  useEffect(() => {
    if (open) setCardVisible(true);
  }, [open]);

  // demo 关闭时不渲染(入口在 RolePicker 里)
  if (!open) return null;

  // demo 开启:渲染 control panel(上)+ card(下)
  const cfg = ROLES[role];
  const theme = THRESHOLDS[threshold];
  const usedCredits = Math.round(cfg.total * (threshold / 100));
  const pct = threshold;

  return (
    <div className="hidden md:flex fixed bottom-[220px] right-6 z-30 flex-col gap-3 items-end">
      {/* Control Panel - 跟 mock card 在同一列,排在上面 */}
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
            onClick={handleCloseDemo}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-500 text-lg leading-none"
          >
            ×
          </button>
        </div>

        <p className="text-[11px] text-neutral-500 mb-3 leading-relaxed">
          Pick a role × threshold. Preview shows below.
        </p>

        {/* Role segmented */}
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

        {/* Threshold segmented */}
        <div className="mb-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">Threshold</div>
          <div className="flex gap-1 p-1 bg-neutral-100 rounded-lg">
            {THRESHOLD_OPTIONS.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => pickThreshold(t)}
                className={
                  'flex-1 px-2 py-1.5 rounded-md text-[11px] font-semibold transition-colors ' +
                  (threshold === t ? 'bg-white text-ink shadow-sm' : 'text-neutral-500 hover:text-neutral-700')
                }
              >
                {t}%
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
          onClick={handleCloseDemo}
          className="w-full mt-2 px-3 py-2 rounded-md border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
        >
          Close demo
        </button>
      </div>

      {/* Preview Card - 跟 Control Panel 同列,排在下面 */}
      {cardVisible && (
        <div
          className={
            `w-[340px] rounded-2xl border overflow-hidden ` +
            `${theme.cardBg} ${theme.cardBorder} ${theme.cardShadow} ` +
            `backdrop-blur-sm`
          }
          role="status"
          aria-label={`${cfg.label} credits ${threshold}% warning`}
        >
          <div className="p-5">
            {/* Header: icon circle + title block + close */}
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
                    {cfg.label} plan · Credits
                  </div>
                  <h4 className={`text-[15px] font-bold leading-tight mt-0.5 ${theme.titleColor}`}>
                    {cfg.copy[threshold].title}
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
                  <span className="font-bold text-neutral-900 text-[15px]">{fmtNumber(usedCredits)}</span>
                  <span className="text-neutral-400"> / {fmtNumber(cfg.total)}</span>
                  <span className="text-neutral-500 ml-1">credits used</span>
                </div>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${theme.chipBg} ${theme.chipText}`}
                >
                  {pct}%
                </span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${theme.progressTrack} shadow-inner`}>
                <div
                  className={`h-full rounded-full ${theme.progressFill} shadow-sm transition-all duration-500 ease-out`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              {/* 周期倒计时上下文(loss aversion + 紧迫感)*/}
              <div className="mt-2 flex items-center gap-1 text-[11px] text-neutral-500">
                <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <polyline points="12 7 12 12 15 14" />
                </svg>
                <span>{cfg.renewalCopy}</span>
              </div>
            </div>

            {/* Value copy + deliverables(可感知产出) */}
            <div className="mb-3 rounded-lg bg-white/60 backdrop-blur-sm p-2.5 border border-white/80">
              <p className="text-[12px] text-neutral-700 leading-relaxed">
                {cfg.copy[threshold].value}
              </p>
              <p className="mt-1.5 text-[11px] text-neutral-500 font-medium">
                {cfg.upgrade.deliverables}
              </p>
            </div>

            {/* Unlock tags — 提醒升级解锁的核心功能,不只是更多 credits */}
            <div className="mb-3 flex flex-wrap gap-1.5">
              {cfg.upgrade.unlocks.map(u => (
                <span
                  key={u.label}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/80 border border-neutral-200 text-[10.5px] font-medium text-neutral-700"
                >
                  <span aria-hidden>{u.icon}</span>
                  {u.label}
                </span>
              ))}
            </div>

            {/* Upgrade CTA - 品牌渐变(#FFA73C → #FF5255),常驻 */}
            <button
              type="button"
              onClick={() => {
                // eslint-disable-next-line no-console
                console.log('[Demo] Upgrade clicked', { role, threshold });
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
              <span>{cfg.upgradeLabel.replace(' →', '')}</span>
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>

            {/* Annual offer — 替代原 Cancel anytime,在最高 intent 瞬间抓 yearly 转化 */}
            {cfg.upgrade.annualOffer && (
              <button
                type="button"
                onClick={() => {
                  // eslint-disable-next-line no-console
                  console.log('[Demo] Annual upgrade clicked', { role, threshold });
                }}
                className="mt-2 w-full text-center text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 underline underline-offset-2"
              >
                👉 {cfg.upgrade.annualOffer}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

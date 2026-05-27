import { useEffect, useState } from 'react';
import type { UserRole } from '@/hooks/useUserRole';

/**
 * Global top banner — role-aware promotion with countdown + 7-day dismiss.
 *
 * Per-role copy(同事建议):
 * - Free → 推 Starter(年付 3.6 months free)
 * - Starter → 推 Pro(Seedance 2.0)
 * - Pro → 推 Ultra(Long Video / Priority)
 * - Ultra → 推 slider 加量(33% / 40% bulk discount)
 *
 * Dismiss 规则:
 * - X 关掉后 localStorage 存时间戳,**7 天内**不再显示
 * - 角色变化 / 7 天后再现
 */

interface PromoConfig {
  badge: string;
  emoji: string;
  copy: string;
  highlights: string[]; // 文案里高亮的产品名(lime 绿色)
  cta: string;
}

const PROMO_BY_ROLE: Record<UserRole, PromoConfig> = {
  free: {
    badge: '30% OFF',
    emoji: '⚡',
    copy: 'Stop running on empty. Upgrade to Starter to remove watermarks & unlock Premium Video Models.',
    highlights: ['Starter'],
    cta: 'Get 3.6 Months Free →',
  },
  starter: {
    badge: 'UPGRADE PRO',
    emoji: '🎬',
    copy: 'Unlock Seedance 2.0 cinematic video + Technical Support — Pro’s elite models.',
    highlights: ['Seedance 2.0', 'Technical Support'],
    cta: 'Upgrade to Pro →',
  },
  pro: {
    badge: 'GO ULTRA',
    emoji: '🎞',
    copy: 'Unlock Long Video Generation + Priority Processing on Ultra.',
    highlights: ['Long Video Generation', 'Priority Processing'],
    cta: 'Upgrade to Ultra →',
  },
  ultra: {
    badge: 'RUNNING HOT?',
    emoji: '📦',
    copy: 'Scaling up this month? Drag your volume slider to save up to 40% on credits.',
    highlights: ['40%'],
    cta: 'Scale Credit Limit →',
  },
};

const DISMISS_KEY = 'buzz_promo_dismissed_at';
const DISMISS_DURATION_MS = 24 * 60 * 60 * 1000; // 24h,关掉后 24 小时再显示
const COUNTDOWN_START_KEY = 'buzz_promo_countdown_start';
const COUNTDOWN_DURATION_MS = 24 * 60 * 60 * 1000; // 24h 一次性,过期后倒计时消失

interface PromoBannerProps {
  role: UserRole;
  /** Preview mode — 显示左上角小 label 区分(用于一次性展示所有 role 的 banner) */
  previewLabel?: string;
}

export function PromoBanner({ role, previewLabel }: PromoBannerProps) {
  const isPreview = !!previewLabel;
  const [visible, setVisible] = useState(isPreview); // preview 模式始终可见,不走 dismiss 逻辑

  // 初始化:检查 localStorage 是否在 7 天内被 dismiss 过(preview 模式跳过)
  useEffect(() => {
    if (isPreview) {
      setVisible(true);
      return;
    }
    try {
      const dismissedAt = localStorage.getItem(DISMISS_KEY);
      if (dismissedAt) {
        const elapsed = Date.now() - Number(dismissedAt);
        if (elapsed < DISMISS_DURATION_MS) {
          setVisible(false);
          return;
        }
      }
    } catch {
      /* localStorage unavailable */
    }
    setVisible(true);
  }, [isPreview]);

  // 角色变化时,重新评估是否显示(给不同 role 不同的 dismiss state 也是合理的,但本期共享)
  // ESC 关闭
  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // 倒计时:mock 当天 00:00 (UTC) 之前的剩余时间,营造紧迫感
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!visible) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [visible]);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* localStorage unavailable */
    }
  };

  if (!visible) return null;

  const cfg = PROMO_BY_ROLE[role];

  // 一次性 24 小时倒计时:从用户首次访问起算,过期后倒计时消失(banner 继续显示)
  let countdownText: string | null = null;
  try {
    let start = Number(localStorage.getItem(COUNTDOWN_START_KEY));
    if (!start || Number.isNaN(start)) {
      start = Date.now();
      localStorage.setItem(COUNTDOWN_START_KEY, String(start));
    }
    const msLeft = COUNTDOWN_DURATION_MS - (now - start);
    if (msLeft > 0) {
      const h = String(Math.floor(msLeft / 3600000)).padStart(2, '0');
      const m = String(Math.floor((msLeft % 3600000) / 60000)).padStart(2, '0');
      const s = String(Math.floor((msLeft % 60000) / 1000)).padStart(2, '0');
      countdownText = `${h}:${m}:${s}`;
    }
  } catch {
    /* localStorage unavailable — 倒计时不显示,不影响 banner 主体 */
  }

  return (
    <div role="region" aria-label="Promotional banner" className="relative w-full bg-ink text-neutral-200">
      {/* Preview 模式:左上角 role 标签 */}
      {previewLabel && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 text-[10px] font-bold uppercase tracking-wider text-neutral-300">
            Preview · {previewLabel}
          </span>
        </div>
      )}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-3 pr-12 sm:pr-14 flex items-center gap-4 min-h-[48px]">
        <a
          href="#plans"
          className="flex-1 flex items-center justify-center gap-2 text-sm font-medium flex-wrap hover:text-white transition-colors"
        >
          {/* 红色斜切 badge — 文案 per role */}
          <span
            className="inline-flex items-center text-[11px] font-extrabold text-white px-2 py-0.5 leading-none tracking-wider"
            style={{
              background: 'linear-gradient(135deg, #ff0051 0%, #ff3d7a 100%)',
              transform: 'skewX(-14deg)',
              boxShadow: '0 2px 8px rgba(255, 0, 81, 0.35)',
              borderRadius: '4px',
            }}
          >
            <span style={{ transform: 'skewX(14deg)', display: 'inline-block' }}>{cfg.badge}</span>
          </span>

          {/* Emoji + 正文 + lime 绿色高亮关键词 */}
          <span aria-hidden>{cfg.emoji}</span>
          <span>{renderHighlighted(cfg.copy, cfg.highlights)}</span>

          {/* 倒计时 — 一次性 24 小时,过期后整个 chip 消失 */}
          {countdownText && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider"
              style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#a3e635' }}
              aria-label="Promotion countdown"
            >
              <span aria-hidden>⏳</span>
              {countdownText}
            </span>
          )}
        </a>

        <a
          href="#plans"
          className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-bold whitespace-nowrap transition-opacity hover:opacity-90"
          style={{ background: '#a3e635', color: '#0a0a0a' }}
        >
          {cfg.cta}
        </a>
      </div>

      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss promotional banner (hidden for 24 hours)"
        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 focus:text-white focus:bg-white/10 transition-colors focus:outline-none"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

/** 简单的 highlight 函数 — 把文案里出现 highlights 数组里的词渲染成 lime 绿粗体 */
function renderHighlighted(copy: string, highlights: string[]) {
  if (highlights.length === 0) return copy;
  // 把 copy 按 highlight 切分,各段渲染
  const parts: (string | { text: string; highlight: true })[] = [copy];
  for (const h of highlights) {
    for (let i = parts.length - 1; i >= 0; i--) {
      const part = parts[i];
      if (typeof part !== 'string') continue;
      const idx = part.indexOf(h);
      if (idx === -1) continue;
      const before = part.slice(0, idx);
      const after = part.slice(idx + h.length);
      const replacement: (string | { text: string; highlight: true })[] = [];
      if (before) replacement.push(before);
      replacement.push({ text: h, highlight: true });
      if (after) replacement.push(after);
      parts.splice(i, 1, ...replacement);
    }
  }
  return (
    <>
      {parts.map((p, i) =>
        typeof p === 'string'
          ? <span key={i}>{p}</span>
          : <span key={i} className="font-bold" style={{ color: '#a3e635' }}>{p.text}</span>
      )}
    </>
  );
}

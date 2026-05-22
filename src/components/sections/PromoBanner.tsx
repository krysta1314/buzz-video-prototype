import { useEffect, useState } from 'react';

/**
 * Global top banner — promotes unlimited access for top premium models.
 *
 * Dismiss rules (per current PRD):
 * - Visible on every page load — no persistence.
 * - X / Esc closes the banner for the current page view only.
 * - On page refresh, the banner reappears.
 * - CTA / message click → navigates to #plans, does NOT dismiss.
 */
export function PromoBanner() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setVisible(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible]);

  if (!visible) return null;

  return (
    <div role="region" aria-label="Promotional banner" className="relative w-full bg-ink text-neutral-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-3 pr-12 sm:pr-14 flex items-center gap-4 min-h-[48px]">
        <a
          href="#plans"
          className="flex-1 flex items-center justify-center gap-2 text-sm font-medium flex-wrap hover:text-white transition-colors"
        >
          <span
            className="inline-flex items-center text-[11px] font-extrabold text-white px-2 py-0.5 leading-none tracking-wider"
            style={{
              background: 'linear-gradient(135deg, #ff0051 0%, #ff3d7a 100%)',
              transform: 'skewX(-14deg)',
              boxShadow: '0 2px 8px rgba(255, 0, 81, 0.35)',
              borderRadius: '4px',
            }}
          >
            <span style={{ transform: 'skewX(14deg)', display: 'inline-block' }}>30% OFF</span>
          </span>
          <span aria-hidden>🚀</span>
          <span>Unlock unlimited access ·</span>
          <span className="font-bold" style={{ color: '#a3e635' }}>Seedance 2.0</span>
          <span>+</span>
          <span className="font-bold" style={{ color: '#a3e635' }}>GPT Image 2</span>
        </a>

        <a
          href="#plans"
          className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-bold whitespace-nowrap transition-opacity hover:opacity-90"
          style={{ background: '#a3e635', color: '#0a0a0a' }}
        >
          Upgrade now →
        </a>
      </div>

      <button
        type="button"
        onClick={() => setVisible(false)}
        aria-label="Dismiss promotional banner"
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

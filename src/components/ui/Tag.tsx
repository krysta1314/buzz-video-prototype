import type { ReactNode } from 'react';

type Variant = 'neutral' | 'full' | 'credits' | 'unlimited' | 'count';

interface TagProps {
  children: ReactNode;
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  neutral:   'bg-neutral-100 text-neutral-700',
  full:      'text-ink',
  credits:   'bg-neutral-100 text-neutral-600',
  unlimited: 'bg-emerald-50 text-emerald-700',
  count:     'bg-neutral-100 text-neutral-600',
};

const inlineStyle: Partial<Record<Variant, React.CSSProperties>> = {
  full:      { backgroundColor: '#A3E635' },
};

export function Tag({ children, variant = 'neutral' }: TagProps) {
  return (
    <span
      style={inlineStyle[variant]}
      className={
        'inline-flex items-center px-1.5 py-[2px] rounded ' +
        'text-[10px] font-semibold leading-tight whitespace-nowrap ' +
        variants[variant]
      }
    >
      {children}
    </span>
  );
}

import type { ReactNode } from 'react';

type Variant = 'neutral' | 'access7' | 'access15' | 'full' | 'credits' | 'unlimited' | 'count';

interface TagProps {
  children: ReactNode;
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  neutral:   'bg-neutral-100 text-neutral-700',
  access7:   'text-white',
  access15:  'text-white',
  full:      'text-ink',
  credits:   'bg-neutral-100 text-neutral-600',
  unlimited: 'text-ink',
  count:     'bg-neutral-100 text-neutral-600',
};

const inlineStyle: Partial<Record<Variant, React.CSSProperties>> = {
  access7:   { backgroundColor: '#FC7C4C' },
  access15:  { backgroundColor: '#FC7C4C' },
  full:      { backgroundColor: '#A3E635' },
  unlimited: { backgroundColor: '#A3E635' },
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

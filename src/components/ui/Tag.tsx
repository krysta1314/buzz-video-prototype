import type { ReactNode } from 'react';

type Variant = 'neutral' | 'access7' | 'access15' | 'full' | 'credits' | 'unlimited' | 'count';

interface TagProps {
  children: ReactNode;
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  neutral:   'bg-neutral-100 text-neutral-700',
  access7:   'bg-amber-50 text-amber-800 ring-1 ring-amber-200',
  access15:  'bg-orange-50 text-orange-800 ring-1 ring-orange-200',
  full:      'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200',
  credits:   'bg-white text-neutral-600 ring-1 ring-neutral-300',
  unlimited: 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200',
  count:     'bg-neutral-100 text-neutral-600 ring-1 ring-neutral-200',
};

export function Tag({ children, variant = 'neutral' }: TagProps) {
  return (
    <span
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

import type { AnchorHTMLAttributes, ReactNode } from 'react';

type Variant = 'dark' | 'accent' | 'secondary' | 'outline';

interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant: Variant;
  children: ReactNode;
}

const styles: Record<Variant, string> = {
  dark: 'bg-ink text-white hover:opacity-90',
  accent: 'bg-accent text-white hover:opacity-90',
  secondary: 'bg-secondary text-white hover:opacity-90',
  outline: 'border border-ink text-ink bg-white hover:bg-neutral-50',
};

export function Button({ variant, children, className = '', href = '#', ...rest }: ButtonProps) {
  return (
    <a
      href={href}
      className={`block w-full text-center px-4 py-3 rounded-[10px] font-semibold text-sm transition-opacity transition-colors ${styles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </a>
  );
}

import { BillingToggle } from '@/components/ui/BillingToggle';
import type { BillingCycle } from '@/config/pricing';

interface HeaderProps {
  cycle: BillingCycle;
  onCycleChange: (c: BillingCycle) => void;
}

export function Header({ cycle, onCycleChange }: HeaderProps) {
  return (
    <header className="text-center mb-10 sm:mb-14">
      <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-balance">
        Choose a plan that fits your needs
      </h1>
      <p className="mt-3 text-base text-neutral-500 max-w-xl mx-auto">
        Scale creativity with higher limits, priority access, and early features
      </p>
      <div className="mt-7 inline-flex">
        <BillingToggle value={cycle} onChange={onCycleChange} ariaLabel="Plan cards billing cycle" />
      </div>
    </header>
  );
}

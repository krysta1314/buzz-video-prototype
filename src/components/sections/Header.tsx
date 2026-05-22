import { BillingToggle } from '@/components/ui/BillingToggle';
import { SubscriptionStatusCard } from './SubscriptionStatusCard';
import type { BillingCycle } from '@/config/pricing';
import type { UserRole } from '@/hooks/useUserRole';

interface HeaderProps {
  cycle: BillingCycle;
  onCycleChange: (c: BillingCycle) => void;
  role: UserRole;
}

export function Header({ cycle, onCycleChange, role }: HeaderProps) {
  const isPaid = role !== 'free';
  return (
    <header className="text-center mb-10 sm:mb-14">
      <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-balance">
        Choose a plan that fits your needs
      </h1>
      <p className="mt-3 text-base text-neutral-500 max-w-xl mx-auto">
        Scale creativity with higher limits, priority access, and early features
      </p>
      {isPaid && <SubscriptionStatusCard role={role} />}
      <div className="mt-7 inline-flex">
        <BillingToggle value={cycle} onChange={onCycleChange} ariaLabel="Plan cards billing cycle" />
      </div>
    </header>
  );
}

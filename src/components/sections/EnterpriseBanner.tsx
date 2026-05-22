import { ENTERPRISE_BENEFITS } from '@/config/pricing';
import { Button } from '@/components/ui/Button';
import { Check } from '@/components/ui/Check';

export function EnterpriseBanner() {
  return (
    <section className="mt-12 border border-neutral-200 rounded-2xl p-8 sm:p-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_280px] gap-8 lg:gap-12 items-center">
        {/* Left — feature list, 2 columns */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
          {ENTERPRISE_BENEFITS.map(b => (
            <Check key={b} color="#16a34a">{b}</Check>
          ))}
        </ul>

        {/* Vertical divider (large screens only) */}
        <div className="hidden lg:block w-px self-stretch bg-neutral-200" aria-hidden />

        {/* Right — heading + CTA */}
        <div className="flex flex-col gap-5">
          <div>
            <h3 className="text-2xl font-bold tracking-tight leading-tight">
              Enterprise
            </h3>
            <p className="text-sm text-neutral-500 mt-1">Teams &amp; companies</p>
          </div>
          <Button variant="outline" className="!py-3">Contact Sales</Button>
        </div>
      </div>
    </section>
  );
}

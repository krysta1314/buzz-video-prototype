import { FEATURE_SECTIONS, type AccessValue } from '@/config/features';
import type { PlanId } from '@/config/pricing';
import { Tag } from '@/components/ui/Tag';
import { InfoIcon } from '@/components/ui/InfoIcon';

interface FeatureMatrixProps {
  planId: PlanId;
}

export function FeatureMatrix({ planId }: FeatureMatrixProps) {
  return (
    <div className="flex flex-col gap-5">
      {FEATURE_SECTIONS.map(section => (
        <div key={section.title}>
          <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-ink mb-3">
            {section.title}
          </div>
          <ul className="flex flex-col gap-2">
            {section.rows.map(row => {
              const value = row.values[planId];
              const disabled = value.kind === 'no';
              const windowDays = value.kind === 'window'
                ? (value.window === '7d' ? 7 : 15)
                : null;
              return (
                <li
                  key={row.label}
                  className={`flex items-start gap-2 text-[12px] leading-snug ${disabled ? 'text-neutral-400' : ''}`}
                >
                  <span className={`flex-1 min-w-0 ${disabled ? 'text-neutral-400' : 'text-neutral-800'}`}>
                    {row.label}
                    {windowDays !== null && (
                      <span className="ml-1.5 inline-flex">
                        <InfoIcon label={`${row.label} access details`}>
                          <div>
                            • {planId.charAt(0).toUpperCase() + planId.slice(1)} plan includes a bonus {windowDays}-Day access for {row.label}. Each generation consumes credits.
                          </div>
                          <div className="mt-1">
                            • Available for consecutive {windowDays} days after purchase or renewal.
                          </div>
                        </InfoIcon>
                      </span>
                    )}
                  </span>
                  <span className="flex-shrink-0 flex justify-end items-start">
                    <Value value={value} />
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Value({ value }: { value: AccessValue }) {
  switch (value.kind) {
    case 'yes':
      return <span aria-label="included" className="text-emerald-600 font-bold text-[14px] leading-none">✓</span>;
    case 'no':
      return <span aria-label="not included" className="text-neutral-300 font-bold text-[13px] leading-none">✗</span>;
    case 'value':
      return <Tag variant={value.label === 'Unlimited' ? 'unlimited' : 'count'}>{value.label}</Tag>;
    case 'full':
      return <Tag variant="full">Full Access</Tag>;
    case 'window':
      return (
        <Tag variant={value.window === '7d' ? 'access7' : 'access15'}>
          {value.window === '7d' ? '+7-Day Access / mo' : '+15-Day Access / mo'}
        </Tag>
      );
  }
}

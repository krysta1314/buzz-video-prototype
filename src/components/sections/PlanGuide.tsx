import { GUIDE } from '@/config/pricing';

export function PlanGuide() {
  return (
    <section className="mt-20 bg-neutral-50 rounded-2xl p-8 sm:p-12">
      <header className="text-center mb-12">
        <h2 className="text-2xl sm:text-[28px] font-bold tracking-tight">
          Not sure which plan is right for you?
        </h2>
        <p className="mt-2 text-sm text-neutral-500">
          A quick guide to picking the right tier for how you work.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {GUIDE.map(g => (
          <article key={g.id}>
            <header className="pb-4 border-b border-neutral-200">
              <h3 className="text-2xl font-bold tracking-tight">{g.name}</h3>
              <p className="mt-1 text-[13px] text-neutral-500 leading-snug">{g.tagline}</p>
            </header>

            <GuideList label="Suitable for" items={g.suitableFor} />
            <GuideList label="Core features" items={g.coreFeatures} />
          </article>
        ))}
      </div>
    </section>
  );
}

function GuideList({ label, items }: { label: string; items: string[] }) {
  return (
    <section className="mt-5">
      <h4 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-neutral-400">
        {label}
      </h4>
      <ul className="mt-2.5 space-y-1.5">
        {items.map(i => (
          <li
            key={i}
            className="relative pl-3.5 text-[13px] leading-[1.55] text-neutral-700"
          >
            <span aria-hidden className="absolute left-0 top-[9px] w-1 h-1 rounded-full bg-neutral-300" />
            {i}
          </li>
        ))}
      </ul>
    </section>
  );
}

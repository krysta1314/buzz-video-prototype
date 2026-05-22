import { usePricingState } from '@/hooks/usePricingState';
import { PromoBanner } from '@/components/sections/PromoBanner';
import { Header } from '@/components/sections/Header';
import { PlanCards } from '@/components/sections/PlanCards';
import { EnterpriseBanner } from '@/components/sections/EnterpriseBanner';
import { CompareFeatures } from '@/components/sections/CompareFeatures';
import { PlanGuide } from '@/components/sections/PlanGuide';
import { Faq } from '@/components/sections/Faq';

export default function App() {
  const state = usePricingState();

  return (
    <>
      <PromoBanner />
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
        <Header cycle={state.cards.cycle} onCycleChange={state.cards.setCycle} />
        <section id="plans">
          <PlanCards region={state.cards} />
        </section>
        <EnterpriseBanner />
        <CompareFeatures region={state.cmp} />
        <PlanGuide />
        <Faq />
      </main>
    </>
  );
}

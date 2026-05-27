import { useState } from 'react';
import { usePricingState } from '@/hooks/usePricingState';
import { useUserRole } from '@/hooks/useUserRole';
import { PromoBanner } from '@/components/sections/PromoBanner';
import { Header } from '@/components/sections/Header';
import { PlanCards } from '@/components/sections/PlanCards';
import { EnterpriseBanner } from '@/components/sections/EnterpriseBanner';
import { CompareFeatures } from '@/components/sections/CompareFeatures';
import { PlanGuide } from '@/components/sections/PlanGuide';
import { Faq } from '@/components/sections/Faq';
import { RolePicker } from '@/components/ui/RolePicker';
import { CreditsWarningDemo } from '@/components/demos/CreditsWarningDemo';

export default function App() {
  const state = usePricingState();
  const { role, setRole } = useUserRole();
  // demo 开关 state 上提到 App,让 RolePicker 内的按钮也能触发
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <>
      {/* Preview mode:一次性展示 4 种 role 的 banner,用 previewLabel 区分。
          关闭 preview 模式只需把这 4 行换回 <PromoBanner role={role} /> */}
      <PromoBanner role="free"    previewLabel="Free user" />
      <PromoBanner role="starter" previewLabel="Starter user" />
      <PromoBanner role="pro"     previewLabel="Pro user" />
      <PromoBanner role="ultra"   previewLabel="Ultra user" />
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
        <Header cycle={state.cards.cycle} onCycleChange={state.cards.setCycle} role={role} />
        <section id="plans">
          <PlanCards region={state.cards} role={role} />
        </section>
        <EnterpriseBanner />
        <CompareFeatures region={state.cmp} />
        <PlanGuide />
        <Faq />
      </main>
      <RolePicker role={role} setRole={setRole} onDemoClick={() => setDemoOpen(true)} />
      <CreditsWarningDemo open={demoOpen} onClose={() => setDemoOpen(false)} />
    </>
  );
}

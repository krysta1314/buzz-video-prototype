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
  // Preview banner 4 条默认隐藏,右上角 icon 控制显隐
  const [bannersVisible, setBannersVisible] = useState(false);

  return (
    <>
      {/* Preview mode:4 个 role banner 默认隐藏,点右上角喇叭 icon 切换显示 */}
      {bannersVisible && (
        <>
          <PromoBanner role="free"    previewLabel="Free user" />
          <PromoBanner role="starter" previewLabel="Starter user" />
          <PromoBanner role="pro"     previewLabel="Pro user" />
          <PromoBanner role="ultra"   previewLabel="Ultra user" />
        </>
      )}
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

      {/* 浮动 icon — 控制 4 个 preview banner 显隐(只为内部预览用,正式上线删) */}
      <button
        type="button"
        onClick={() => setBannersVisible(v => !v)}
        aria-label={bannersVisible ? 'Hide preview banners' : 'Show preview banners'}
        title={bannersVisible ? 'Hide preview banners' : 'Show preview banners'}
        className="hidden md:flex fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-ink text-white shadow-lg hover:scale-105 transition-transform items-center justify-center"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M3 11l18-5v12L3 14v-3z" />
          <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
        </svg>
      </button>
    </>
  );
}

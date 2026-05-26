import { useState } from 'react';
import { GUIDE, type PlanId } from '@/config/pricing';

type Volume = 'low' | 'mid' | 'high' | 'explore';
type SeedanceNeed = 'yes' | 'maybe' | 'no';
type TeamSize = 'solo' | 'small' | 'large';

type Recommendation = PlanId | 'enterprise';

interface Answers {
  volume: Volume;
  seedance: SeedanceNeed;
  team: TeamSize;
}

interface QuizStateIntro { step: 'intro' }
interface QuizStateQ { step: 'q1' | 'q2' | 'q3'; answers: Partial<Answers> }
interface QuizStateResult { step: 'result'; answers: Answers; recommendation: Recommendation }
type QuizState = QuizStateIntro | QuizStateQ | QuizStateResult;

const QUESTION_TEXT: Record<'q1' | 'q2' | 'q3', { title: string; key: keyof Answers; options: { value: string; label: string; sub?: string }[] }> = {
  q1: {
    title: 'How many ads or creatives do you ship per week?',
    key: 'volume',
    options: [
      { value: 'explore', label: 'Just exploring',  sub: 'Trying things out, no production yet' },
      { value: 'low',     label: '1–3 per week',    sub: 'Occasional ad campaigns' },
      { value: 'mid',     label: '4–15 per week',   sub: 'Steady weekly cadence' },
      { value: 'high',    label: '15+ per week',    sub: 'High-volume / agency workflow' },
    ],
  },
  q2: {
    title: 'Do you need Seedance 2.0 (cinematic-quality video)?',
    key: 'seedance',
    options: [
      { value: 'yes',   label: 'Yes' },
      { value: 'maybe', label: 'Maybe occasionally' },
      { value: 'no',    label: 'No, I focus on images' },
    ],
  },
  q3: {
    title: 'Are you working solo or with a team?',
    key: 'team',
    options: [
      { value: 'solo',  label: 'Just me' },
      { value: 'small', label: 'Small team (2–5)' },
      { value: 'large', label: 'Larger team / agency (5+)' },
    ],
  },
};

/** 简单加权 — 每个回答给候选 plan 加分，最高分为推荐。 */
function computeRecommendation(a: Answers): Recommendation {
  const score: Record<Recommendation, number> = {
    free: 0, starter: 0, pro: 0, ultra: 0, enterprise: 0,
  };

  // Q1 — volume 决定主轴
  if (a.volume === 'explore') score.free += 3;
  if (a.volume === 'low')     score.starter += 3;
  if (a.volume === 'mid')     score.pro += 3;
  if (a.volume === 'high')    score.ultra += 3;

  // Q2 — Seedance 2.0 需求把下限拉到 Pro
  if (a.seedance === 'yes') {
    score.starter -= 2;
    score.pro += 2;
    score.ultra += 1;
  }
  if (a.seedance === 'maybe') {
    score.pro += 1;
  }

  // Q3 — 团队规模 push 向 Ultra/Enterprise
  if (a.team === 'small') {
    score.pro += 1;
    score.ultra += 1;
  }
  if (a.team === 'large') {
    score.ultra += 1;
    score.enterprise += 2;
  }

  // 选最高分
  const entries = Object.entries(score) as [Recommendation, number][];
  entries.sort((x, y) => y[1] - x[1]);
  return entries[0][0];
}

const RECOMMENDATION_REASON: Record<Recommendation, string> = {
  free:       'Start free, no credit card needed — get a feel for the product before committing.',
  starter:    'For occasional ad campaigns at the lowest entry point — all image models + most video models.',
  pro:        'The sweet spot for weekly ad production — full model access including Seedance 2.0, and technical support.',
  ultra:      'Built for high-volume workflows — highest credit allowance, Long Video Early Access, and priority processing.',
  enterprise: 'For larger teams that need multi-user seats, dedicated capacity, API access, and a custom SLA.',
};

const RECOMMENDATION_HUE: Record<Recommendation, string> = {
  free:       'border-neutral-300 bg-white',
  starter:    'border-ink bg-neutral-50',
  pro:        'border-accent bg-orange-50',
  ultra:      'border-secondary bg-violet-50',
  enterprise: 'border-emerald-500 bg-emerald-50',
};

const RECOMMENDATION_LABEL: Record<Recommendation, string> = {
  free: 'Free', starter: 'Starter', pro: 'Pro', ultra: 'Ultra', enterprise: 'Enterprise',
};

export function PlanGuide() {
  const [state, setState] = useState<QuizState>({ step: 'intro' });

  const startQuiz = () => setState({ step: 'q1', answers: {} });
  const resetQuiz = () => setState({ step: 'intro' });

  const answerQuestion = (key: keyof Answers, value: string) => {
    if (state.step !== 'q1' && state.step !== 'q2' && state.step !== 'q3') return;
    const next = { ...state.answers, [key]: value } as Partial<Answers>;
    if (state.step === 'q1') setState({ step: 'q2', answers: next });
    else if (state.step === 'q2') setState({ step: 'q3', answers: next });
    else {
      // q3 finished
      const full = next as Answers;
      setState({ step: 'result', answers: full, recommendation: computeRecommendation(full) });
    }
  };

  return (
    <section className="mt-20 bg-neutral-50 rounded-2xl p-8 sm:p-12">
      <header className="text-center mb-8">
        <h2 className="text-2xl sm:text-[28px] font-bold tracking-tight">
          Not sure which plan is right for you?
        </h2>
        <p className="mt-2 text-sm text-neutral-500">
          Answer 3 quick questions and we&rsquo;ll point you to the best fit.
        </p>

        {state.step === 'intro' && (
          <button
            type="button"
            onClick={startQuiz}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-ink text-white text-sm font-semibold hover:opacity-90"
          >
            Take the 30-second quiz →
          </button>
        )}
      </header>

      {/* Quiz UI */}
      {(state.step === 'q1' || state.step === 'q2' || state.step === 'q3') && (
        <QuestionStep
          stepKey={state.step}
          onAnswer={answerQuestion}
          onCancel={resetQuiz}
        />
      )}

      {state.step === 'result' && (
        <ResultCard
          recommendation={state.recommendation}
          onRetake={startQuiz}
        />
      )}

      {/* 4 persona cards — 始终可见作为 reference */}
      <div className="mt-10 pt-10 border-t border-neutral-200">
        <h3 className="text-center text-[13px] font-semibold uppercase tracking-wider text-neutral-500 mb-6">
          Or browse the plans by persona
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {GUIDE.map(g => (
            <article key={g.id}>
              <header className="pb-4 border-b border-neutral-200">
                <h4 className="text-2xl font-bold tracking-tight">{g.name}</h4>
                <p className="mt-1 text-[13px] text-neutral-500 leading-snug">{g.tagline}</p>
              </header>

              <GuideList label="Suitable for" items={g.suitableFor} />
              <GuideList label="Core features" items={g.coreFeatures} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

interface QuestionStepProps {
  stepKey: 'q1' | 'q2' | 'q3';
  onAnswer: (key: keyof Answers, value: string) => void;
  onCancel: () => void;
}

function QuestionStep({ stepKey, onAnswer, onCancel }: QuestionStepProps) {
  const q = QUESTION_TEXT[stepKey];
  const stepNum = stepKey === 'q1' ? 1 : stepKey === 'q2' ? 2 : 3;

  return (
    <div className="max-w-xl mx-auto">
      {/* 进度 */}
      <div className="flex items-center gap-2 justify-center mb-6">
        {[1, 2, 3].map(n => (
          <span
            key={n}
            className={`h-1.5 w-8 rounded-full ${n <= stepNum ? 'bg-ink' : 'bg-neutral-300'}`}
          />
        ))}
        <span className="ml-2 text-xs text-neutral-500">Step {stepNum} of 3</span>
      </div>

      <h3 className="text-center text-lg sm:text-xl font-bold tracking-tight mb-5">
        {q.title}
      </h3>

      <div className="space-y-2">
        {q.options.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onAnswer(q.key, opt.value)}
            className="w-full text-left px-4 py-3 rounded-xl border border-neutral-300 bg-white hover:border-ink hover:bg-neutral-50 transition-colors"
          >
            <div className="text-sm font-semibold text-ink">{opt.label}</div>
            {opt.sub && <div className="text-xs text-neutral-500 mt-0.5">{opt.sub}</div>}
          </button>
        ))}
      </div>

      <div className="text-center mt-5">
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-neutral-500 hover:text-neutral-700 underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

interface ResultCardProps {
  recommendation: Recommendation;
  onRetake: () => void;
}

function ResultCard({ recommendation, onRetake }: ResultCardProps) {
  const label = RECOMMENDATION_LABEL[recommendation];
  const reason = RECOMMENDATION_REASON[recommendation];
  const hue = RECOMMENDATION_HUE[recommendation];
  // 跳转 anchor：plan 跳 #plans；enterprise 跳 #enterprise（如果有）
  const anchor = recommendation === 'enterprise' ? '#enterprise' : '#plans';

  return (
    <div className={`max-w-xl mx-auto rounded-2xl border-2 p-6 sm:p-8 ${hue}`}>
      <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2">
        We recommend
      </div>
      <h3 className="text-3xl font-bold tracking-tight mb-2">{label}</h3>
      <p className="text-sm text-neutral-700 leading-relaxed mb-5">{reason}</p>

      <div className="flex flex-wrap gap-3">
        <a
          href={anchor}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-[10px] bg-ink text-white text-sm font-semibold hover:opacity-90"
        >
          See {label} plan →
        </a>
        <button
          type="button"
          onClick={onRetake}
          className="inline-flex items-center px-5 py-2.5 rounded-[10px] border border-neutral-300 text-neutral-700 text-sm font-semibold hover:bg-white"
        >
          Retake quiz
        </button>
      </div>
    </div>
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

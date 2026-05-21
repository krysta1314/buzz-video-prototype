// Pricing configuration — single source of truth.
// Modify here to change prices, plans, models, copy. Components read this only.

export type PlanId = 'free' | 'starter' | 'pro' | 'ultra';
export type PaidPlanId = Exclude<PlanId, 'free'>;
export type Scale = 1 | 2 | 3 | 4 | 6;
export type BillingCycle = 'monthly' | 'yearly';

export const SCALES: readonly Scale[] = [1, 2, 3, 4, 6] as const;

export interface PlanCopy {
  id: PlanId;
  name: string;
  tagline: string;
  cta: string;
  badge?: { label: string; variant: 'popular' | 'team' };
  features: string[];
}

export interface PaidPlanData extends PlanCopy {
  id: PaidPlanId;
  baseMonthlyPrice: number;
  baseYearlyMonthlyPrice: number;
  baseYearlyAnnualTotal: number;
  baseMonthlyCredits: number;
  /** Image model id for credits sub-example */
  exampleImageModel: ModelId;
  /** Video model id for credits sub-example */
  exampleVideoModel: ModelId;
  /** Premium model access window copy */
  accessImage: string;
  accessVideo: string;
}

export interface FreePlanData extends PlanCopy {
  id: 'free';
  oneTimeCredits: number;
  exampleSub: string;
}

export const FREE_PLAN: FreePlanData = {
  id: 'free',
  name: 'Free',
  tagline: 'For creators making their first AI image ad',
  cta: 'Start for Free',
  oneTimeCredits: 500,
  exampleSub: '≈ 27 Seedream 5.0 Lite images',
  features: [
    'Marketing Agent',
    'Image Generation',
    'AI Avatars: 1',
  ],
};

export const PAID_PLANS: Record<PaidPlanId, PaidPlanData> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    tagline: 'For your first AI-powered ad campaigns',
    cta: 'Get Starter',
    baseMonthlyPrice: 19,
    baseYearlyMonthlyPrice: 13.3,
    baseYearlyAnnualTotal: 159.6,
    baseMonthlyCredits: 1900,
    exampleImageModel: 'nano-banana',
    exampleVideoModel: 'seedance-1-5-pro',
    accessImage: '7-Day Unlimited/Month',
    accessVideo: '7-Day Unlimited/Month',
    features: [
      'Marketing Agent',
      'Image & Video Generation',
      'Watermark-free Videos',
      'Character Customization (Seedance 2.0): Unlimited',
      'AI Avatars: Unlimited',
      'Access Models (Image): 7-Day Unlimited/Month',
      'Access Models (Video): 7-Day Unlimited/Month',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    tagline: 'For creators shipping ads every week',
    cta: 'Get Pro',
    badge: { label: 'Most Popular', variant: 'popular' },
    baseMonthlyPrice: 49,
    baseYearlyMonthlyPrice: 34.3,
    baseYearlyAnnualTotal: 411.6,
    baseMonthlyCredits: 4900,
    exampleImageModel: 'nano-banana-2',
    exampleVideoModel: 'seedance-2-fast',
    accessImage: '15-Day Unlimited/Month',
    accessVideo: '15-Day Unlimited/Month',
    features: [
      'Everything in Starter',
      '15-Day Premium Model Access per renewal',
      'Higher credit allowance',
      'Character Customization: Unlimited',
      'AI Avatars: Unlimited',
    ],
  },
  ultra: {
    id: 'ultra',
    name: 'Ultra',
    tagline: 'For marketing teams running ads at scale',
    cta: 'Get Ultra',
    badge: { label: 'For Marketing Teams', variant: 'team' },
    baseMonthlyPrice: 89,
    baseYearlyMonthlyPrice: 62.3,
    baseYearlyAnnualTotal: 747.6,
    baseMonthlyCredits: 8900,
    exampleImageModel: 'gpt-image-2',
    exampleVideoModel: 'seedance-2',
    accessImage: 'Full Access',
    accessVideo: 'Full Access',
    features: [
      'Everything in Pro',
      'Full Access to all premium models',
      'Long Video Generation (Early Access)',
      'Highest credit allowance',
      'Priority processing',
    ],
  },
};

export const PLAN_ORDER: PlanId[] = ['free', 'starter', 'pro', 'ultra'];
export const PAID_PLAN_ORDER: PaidPlanId[] = ['starter', 'pro', 'ultra'];

// =========== Models for Compare Features table ===========

export type ModelId =
  | 'seedream-4-5' | 'seedream-5-lite' | 'nano-banana' | 'nano-banana-2'
  | 'nano-banana-pro' | 'gpt-image-2'
  | 'veo-3-1' | 'veo-3-1-fast' | 'seedance-1-5-pro'
  | 'seedance-2' | 'seedance-2-fast' | 'kling-3';

export type ModelCategory = 'image' | 'video';

export interface Model {
  id: ModelId;
  name: string;
  category: ModelCategory;
  /** Representative SKU description, e.g. "480p · 10s" */
  sku: string;
  /** Credits per generation */
  pricePerUnit: number;
  /** Free plan availability */
  freeAccess: boolean;
  /** Unit label, e.g. "image" or "video" */
  unitLabel: 'image' | 'video';
}

export const MODELS: readonly Model[] = [
  // Image
  { id: 'seedream-4-5',    name: 'Seedream 4.5',      category: 'image', sku: 'default',          pricePerUnit: 21,   freeAccess: true,  unitLabel: 'image' },
  { id: 'seedream-5-lite', name: 'Seedream 5.0 Lite', category: 'image', sku: 'default',          pricePerUnit: 18,   freeAccess: true,  unitLabel: 'image' },
  { id: 'nano-banana',     name: 'Nano Banana',       category: 'image', sku: 'default',          pricePerUnit: 20,   freeAccess: false, unitLabel: 'image' },
  { id: 'nano-banana-2',   name: 'Nano Banana 2',     category: 'image', sku: '1K',               pricePerUnit: 34,   freeAccess: false, unitLabel: 'image' },
  { id: 'nano-banana-pro', name: 'Nano Banana Pro',   category: 'image', sku: '1K',               pricePerUnit: 68,   freeAccess: false, unitLabel: 'image' },
  { id: 'gpt-image-2',     name: 'GPT Image 2',       category: 'image', sku: '1:1 / low',        pricePerUnit: 8,    freeAccess: false, unitLabel: 'image' },
  // Video
  { id: 'veo-3-1',         name: 'Veo 3.1',           category: 'video', sku: '720p · 8s',        pricePerUnit: 1600, freeAccess: false, unitLabel: 'video' },
  { id: 'veo-3-1-fast',    name: 'Veo 3.1 Fast',      category: 'video', sku: '720p · 8s',        pricePerUnit: 400,  freeAccess: false, unitLabel: 'video' },
  { id: 'seedance-1-5-pro',name: 'Seedance 1.5 Pro',  category: 'video', sku: '480p · 10s',       pricePerUnit: 58,   freeAccess: false, unitLabel: 'video' },
  { id: 'seedance-2',      name: 'Seedance 2.0',      category: 'video', sku: '480p · 10s',       pricePerUnit: 337,  freeAccess: false, unitLabel: 'video' },
  { id: 'seedance-2-fast', name: 'Seedance 2.0 Fast', category: 'video', sku: '480p · 10s',       pricePerUnit: 270,  freeAccess: false, unitLabel: 'video' },
  { id: 'kling-3',         name: 'Kling 3.0',         category: 'video', sku: 'std · 5s',         pricePerUnit: 175,  freeAccess: false, unitLabel: 'video' },
] as const;

export const MODEL_BY_ID: Record<ModelId, Model> = Object.fromEntries(
  MODELS.map(m => [m.id, m]),
) as Record<ModelId, Model>;

// =========== Access policies for Compare Features ===========

export const ACCESS_POLICY = {
  image: { free: 'Free Models Only', starter: '7-Day Unlimited/Month', pro: '15-Day Unlimited/Month', ultra: 'Full Access' },
  video: { free: '✗',                starter: '7-Day Unlimited/Month', pro: '15-Day Unlimited/Month', ultra: 'Full Access' },
} satisfies Record<ModelCategory, Record<PlanId, string>>;

// =========== "Not sure which plan" guide ===========

export interface GuideEntry {
  id: PlanId | 'enterprise';
  name: string;
  tagline: string;
  suitableFor: string[];
  coreFeatures: string[];
}

export const GUIDE: GuideEntry[] = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'For your first AI-powered ad campaigns',
    suitableFor: [
      'Independent sellers and Shopify store owners',
      'DTC founders just getting started',
      'Solo creators testing AI ads before scaling spend',
    ],
    coreFeatures: [
      'Marketing Agent for ad ideas and copy',
      'Image & video ad generation',
      '7-day premium model access per renewal',
      'Watermark-free videos',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'For creators shipping ads every week',
    suitableFor: [
      'DTC brands shipping ads every week',
      'Freelance marketers serving multiple clients',
      'Creators running consistent A/B testing across SKUs',
    ],
    coreFeatures: [
      'Marketing Agent for full campaign workflows',
      '15-day premium model access per renewal',
      'Character Customization (Seedance 2.0)',
      'Unlimited AI Avatars',
    ],
  },
  {
    id: 'ultra',
    name: 'Ultra',
    tagline: 'For marketing teams running ads at scale',
    suitableFor: [
      'In-house marketing teams scaling ad output',
      'Agencies producing for multiple brands in parallel',
      'Studios needing long-form video and realistic characters',
    ],
    coreFeatures: [
      'Full access to all premium models',
      'Long Video Generation (Early Access)',
      'Highest credit allowance for high-volume production',
      'Priority processing',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'For large brands and multinational companies',
    suitableFor: [
      'Large brands and multinational companies',
      'Teams requiring SOC 2 / SLA / compliance',
      'Organizations integrating Buzz into existing tools via API',
    ],
    coreFeatures: [
      'Custom credits allocation',
      'Dedicated model capacity',
      'Dedicated account manager + SLA',
      'API access and team training',
    ],
  },
];

// =========== Enterprise banner items ===========

export const ENTERPRISE_BENEFITS = [
  'Team training and onboarding',
  'SLA and dedicated account manager',
  'Custom credits allocation',
  'Dedicated model capacity',
  'Access to all models',
  'Priority queue for faster task processing',
  'API Access',
];

// =========== FAQ ===========

export interface FaqItem {
  question: string;
  /** React-friendly answer node (use plain strings or simple JSX in the consumer) */
  answer: () => React.ReactNode;
}

// (Answers live in src/components/sections/Faq.tsx to keep JSX in components)
export const FAQ_QUESTIONS = [
  'What are credits and how do they work?',
  'What happens if I run out of credits?',
  'Can I cancel my subscription anytime?',
  'How does the Premium Model Access window work?',
  'Can I upgrade or downgrade my plan?',
  'Do you offer refunds?',
  'Can I use Buzz-generated content commercially?',
  'Does Buzz support team or multi-user access?',
] as const;

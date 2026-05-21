import type { PlanId } from './pricing';

/**
 * Feature matrix shown inside each Plan Card (below the CTA button).
 *
 * Each row declares a feature label and the value rendered per plan column.
 * AccessValue variants drive the UI rendering (check / cross / tag / number).
 *
 * Single source of truth — edit here, every card updates.
 */

export type AccessValue =
  | { kind: 'yes' }
  | { kind: 'no' }
  | { kind: 'value'; label: string }
  | { kind: 'window'; window: '7d' | '15d'; creditsApply: boolean }
  | { kind: 'full' };

export interface FeatureRow {
  label: string;
  values: Record<PlanId, AccessValue>;
}

export interface FeatureSection {
  title: string;
  rows: FeatureRow[];
}

const yes: AccessValue = { kind: 'yes' };
const no: AccessValue = { kind: 'no' };
const unlimited: AccessValue = { kind: 'value', label: 'Unlimited' };
const w7: AccessValue = { kind: 'window', window: '7d', creditsApply: true };
const w15: AccessValue = { kind: 'window', window: '15d', creditsApply: true };
const full: AccessValue = { kind: 'full' };

/** Premium model row: gated for Free, windowed for Starter/Pro, full for Ultra. */
const premium = (label: string): FeatureRow => ({
  label,
  values: { free: no, starter: w7, pro: w15, ultra: full },
});

export const FEATURE_SECTIONS: FeatureSection[] = [
  {
    title: 'Key Features',
    rows: [
      { label: 'Marketing Agent',                          values: { free: yes, starter: yes, pro: yes, ultra: yes } },
      { label: 'Image Generation',                         values: { free: yes, starter: yes, pro: yes, ultra: yes } },
      { label: 'Video Generation',                         values: { free: no,  starter: yes, pro: yes, ultra: yes } },
      { label: 'Long Video Generation (Early Access)',     values: { free: no,  starter: no,  pro: no,  ultra: yes } },
      { label: 'No Watermark',                             values: { free: no,  starter: yes, pro: yes, ultra: yes } },
      { label: 'Character Customization (Seedance 2.0)',   values: { free: no,  starter: unlimited, pro: unlimited, ultra: unlimited } },
      { label: 'AI Avatars',                               values: { free: { kind: 'value', label: '1' }, starter: unlimited, pro: unlimited, ultra: unlimited } },
    ],
  },
  {
    title: 'Access Models (Image)',
    rows: [
      { label: 'Seedream 4.5',      values: { free: yes, starter: yes, pro: yes, ultra: yes } },
      { label: 'Seedream 5.0 Lite', values: { free: yes, starter: yes, pro: yes, ultra: yes } },
      premium('Nano Banana'),
      premium('Nano Banana 2'),
      premium('Nano Banana Pro'),
      premium('GPT Image 2'),
    ],
  },
  {
    title: 'Access Models (Video)',
    rows: [
      premium('Veo 3.1'),
      premium('Veo 3.1 Fast'),
      premium('Seedance 1.5 Pro'),
      premium('Seedance 2.0'),
      premium('Seedance 2.0 Fast'),
      premium('Kling 3.0'),
    ],
  },
];

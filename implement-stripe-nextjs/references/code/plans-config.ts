// SOURCE: codegus-foundation/packages/factory/plans/plans-config.ts
// SSOT for plans. Trim to the number of tiers your app needs. For a single-plan
// app, keep only the paid tier and drop PLAN_TIER_RANK + tier comparisons.

export const PLAN_IDS = ['trial', 'solo', 'scale', 'studio'] as const;
export type PlanId = (typeof PLAN_IDS)[number];

export const PUBLIC_PLAN_IDS = ['solo', 'scale', 'studio'] as const;
export type PublicPlanId = (typeof PUBLIC_PLAN_IDS)[number];

export const PURCHASABLE_PLAN_IDS = ['solo', 'scale'] as const;
export type PurchasablePlanId = (typeof PURCHASABLE_PLAN_IDS)[number];

export const PLAN_STATUSES = [
  'active',
  'past_due',
  'canceled',
  'unpaid'
] as const;
export type PlanStatus = (typeof PLAN_STATUSES)[number];

export const SUPPORTED_CURRENCIES = ['usd', 'brl'] as const;
export type Currency = (typeof SUPPORTED_CURRENCIES)[number];

export const TRIAL_DURATION_DAYS = 14;

export const PLAN_TIER_RANK: Record<PlanId, number> = {
  trial: 0,
  solo: 1,
  scale: 2,
  studio: 3
};

export interface PlanLimits {
  contents_per_month: number | null;
  seats: number | null;
  organizations: number | null;
  blocks: number | null;
  image_regenerations_per_month: number | null;
  ai_text_edits_per_month: number | null;
}

export type PlanLimitKey = keyof PlanLimits;

export type FeatureKeyEntry =
  | { key: string }
  | { key: string; limitKey: PlanLimitKey };

export interface PlanI18n {
  nameKey: string;
  blurbKey: string;
  ctaLabelKey: string;
  featureKeys: FeatureKeyEntry[];
  highlightLabelKey?: string;
}

export interface Plan {
  id: PlanId;
  limits: PlanLimits;
  trialDays: number;
  highlight: boolean;
  i18n: PlanI18n;
  ctaHref: string;
}

const TRIAL_LIMITS: PlanLimits = {
  contents_per_month: 3,
  seats: 1,
  organizations: 1,
  blocks: 1_000,
  image_regenerations_per_month: 5,
  ai_text_edits_per_month: 20
};

const SOLO_LIMITS: PlanLimits = {
  contents_per_month: 20,
  seats: 1,
  organizations: 1,
  blocks: 1_000,
  image_regenerations_per_month: 60,
  ai_text_edits_per_month: 200
};

const SCALE_LIMITS: PlanLimits = {
  contents_per_month: 65,
  seats: 5,
  organizations: 3,
  blocks: 5_000,
  image_regenerations_per_month: 250,
  ai_text_edits_per_month: 800
};

const STUDIO_LIMITS: PlanLimits = {
  contents_per_month: null,
  seats: null,
  organizations: null,
  blocks: null,
  image_regenerations_per_month: null,
  ai_text_edits_per_month: null
};

export const PLANS: Record<PlanId, Plan> = {
  trial: {
    id: 'trial',
    limits: TRIAL_LIMITS,
    trialDays: TRIAL_DURATION_DAYS,
    highlight: false,
    i18n: {
      nameKey: 'pricing_tier_trial_name',
      blurbKey: 'pricing_tier_trial_blurb',
      ctaLabelKey: 'pricing_tier_trial_cta',
      featureKeys: []
    },
    ctaHref: '/admin/billing'
  },
  solo: {
    id: 'solo',
    limits: SOLO_LIMITS,
    trialDays: TRIAL_DURATION_DAYS,
    highlight: false,
    i18n: {
      nameKey: 'pricing_tier_solo_name',
      blurbKey: 'pricing_tier_solo_blurb',
      ctaLabelKey: 'pricing_tier_solo_cta',
      featureKeys: [
        { key: 'pricing_tier_solo_feature_seats', limitKey: 'seats' },
        { key: 'pricing_tier_solo_feature_posts', limitKey: 'contents_per_month' }
      ]
    },
    ctaHref: '/admin/billing?plan=solo'
  },
  scale: {
    id: 'scale',
    limits: SCALE_LIMITS,
    trialDays: TRIAL_DURATION_DAYS,
    highlight: true,
    i18n: {
      nameKey: 'pricing_tier_scale_name',
      blurbKey: 'pricing_tier_scale_blurb',
      ctaLabelKey: 'pricing_tier_scale_cta',
      highlightLabelKey: 'pricing_highlight_most_popular',
      featureKeys: [
        { key: 'pricing_tier_scale_feature_seats', limitKey: 'seats' },
        { key: 'pricing_tier_scale_feature_posts', limitKey: 'contents_per_month' }
      ]
    },
    ctaHref: '/admin/billing?plan=scale'
  },
  studio: {
    id: 'studio',
    limits: STUDIO_LIMITS,
    trialDays: 0,
    highlight: false,
    i18n: {
      nameKey: 'pricing_tier_studio_name',
      blurbKey: 'pricing_tier_studio_blurb',
      ctaLabelKey: 'pricing_tier_studio_cta',
      featureKeys: []
    },
    ctaHref: '/contact?service=studio'
  }
};

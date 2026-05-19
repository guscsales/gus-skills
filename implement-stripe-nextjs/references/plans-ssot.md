# Plans SSOT

One config drives pricing UI, checkout, limits, and emails. See `references/code/plans-config.ts` for the canonical shape.

## Shape

```ts
PLAN_IDS         // readonly tuple of plan ids (incl. 'trial' if applicable)
PUBLIC_PLAN_IDS  // ids shown on /pricing
PURCHASABLE_PLAN_IDS  // ids that route through Stripe Checkout (excludes trial + contact-sales)
PLAN_STATUSES    // 'active' | 'past_due' | 'canceled' | 'unpaid'
PLANS: Record<PlanId, Plan>  // limits, trialDays, i18n keys, ctaHref per plan
```

## Adapt to intake

- `plans_count=1` → keep one entry in `PLANS`, drop `PLAN_TIER_RANK`, drop `PUBLIC_PLAN_IDS`/`PURCHASABLE_PLAN_IDS` (just use the single id).
- `plans_count=2-3` → keep ids you need (`solo`, `scale`); drop the rest.
- `plans_count=4+` → use as-is; rename `solo/scale/studio` to your tiers.
- `trial=no` → remove `'trial'` from `PLAN_IDS`, drop `TRIAL_DURATION_DAYS`, drop `trialDays` field on `Plan`.
- `limits=features` → drop `PlanLimits`, drop `limits` field on `Plan`, replace with `features: Record<string, boolean>`.

## Multi-currency Stripe prices (single Price ID, multiple currencies)

Stripe's `currency_options` lets one Price ID hold prices in N currencies. Pass `currency` at the top of `checkout.sessions.create` and Stripe picks the right one.

In Stripe Dashboard → Product → Prices: create the price with USD as base, then **Add currency** → BRL, EUR, etc. One Price ID per plan, not per (plan × currency).

This collapses `STRIPE_PRICE_SOLO_USD`/`STRIPE_PRICE_SOLO_BRL`/... into `STRIPE_PRICE_SOLO`. Was the refactor in commit `ebd7930` of the source repo.

## Env vars

```
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRICE_<PLAN>   # one per PURCHASABLE_PLAN_ID
```

Map plan → Price ID in `stripe-prices.ts`:

```ts
import { env } from '@/env';
import type { PlanId } from './plans-config';

const PRICE_BY_PLAN: Partial<Record<PlanId, string>> = {
  solo: env.STRIPE_PRICE_SOLO,
  scale: env.STRIPE_PRICE_SCALE
};

export function getStripePriceId(planId: PlanId): string {
  const priceId = PRICE_BY_PLAN[planId];
  if (!priceId) throw new Error(`No Stripe price for plan ${planId}`);
  return priceId;
}
```

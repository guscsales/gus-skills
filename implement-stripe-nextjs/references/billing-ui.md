# Billing UI

Two pages, ~5 components.

## `/admin/billing` page (`app/admin/(app)/billing/page.tsx`)

Server component. Fetches:
- Current `plan`, `planStatus`, `trialEndsAt`, `currentPeriodEnd` from session/owner row
- `getDefaultPaymentMethod(orgId)` from Stripe plugin
- `getLatestFailedInvoice(orgId)` if `planStatus === 'past_due'`
- `getAllRemainingLimits(orgId)` if `limits=quotas|both`

Renders:

| Component | Purpose | Skip if |
|---|---|---|
| `billing-overview.tsx` | Status header — current plan, status badge, trial countdown, next billing date, default card | always include |
| `plan-picker.tsx` | Tier comparison cards with CTA → POST `/api/stripe/checkout` | `plans_count=1` |
| `usage-card.tsx` | Per-resource progress bars (used / limit) | `limits=features` |
| `cancel-subscription-dialog.tsx` | Confirm modal → POST `/api/stripe/cancel` | always include |
| `limit-reached-alert.tsx` | Banner shown on overlimit + upsell CTA | `limits=features` |

## API routes (all thin plugin wrappers)

```
POST /api/stripe/checkout       → createHostedCheckoutSession(orgId, planId, urls)
POST /api/stripe/portal         → createBillingPortalSession(orgId, returnUrl)
POST /api/stripe/subscription   → updateSubscriptionPlan(orgId, planId)
POST /api/stripe/cancel         → stripe.subscriptions.update(id, { cancel_at_period_end: true })
POST /api/stripe/webhook        → see references/webhook-events.md
```

Auth pattern: every route except `/webhook` calls `requireSession()` + scopes to the session's `orgId`. The webhook only validates the Stripe signature.

## Embedded checkout option

Default in source repo = **hosted** checkout (Stripe-hosted page, redirect). The `createHostedCheckoutSession` returns a URL — redirect the user.

To switch to **embedded**:

```ts
const session = await stripe.checkout.sessions.create({
  ui_mode: 'embedded',
  // ... same fields ...
  return_url: `${origin}/admin/billing?session_id={CHECKOUT_SESSION_ID}`
});
return { clientSecret: session.client_secret };
```

Then render `<EmbeddedCheckout />` from `@stripe/react-stripe-js`:

```tsx
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

<EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
  <EmbeddedCheckout />
</EmbeddedCheckoutProvider>
```

## Pricing page (`app/(www)/pricing/`)

Public marketing page. Renders from `PLAN_IDS` so editorial copy + price + features come from the same SSOT. Detect currency from request country via `getCurrencyFromCountry()` and display the right `currency_options` price.

Skip entirely if `plans_count=1`.

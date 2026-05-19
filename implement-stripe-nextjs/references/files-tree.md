# Files Tree by Intake

Branch the create-list by intake answers. `[A]` = always, `[T]` = if trial=yes, `[L]` = if limits=quotas|both, `[P2]` = if plans_count ≥ 2.

## Stripe plugin (always)

```
packages/plugins/stripe/
├── client.ts          [A]  copy from references/code/stripe-plugin/client.ts
├── checkout.ts        [A]
├── customer.ts        [A]  rename orgId→userId if owner=user
├── portal.ts          [A]
├── subscription.ts    [A]  [P2] only if plan changes are allowed
├── webhook.ts         [A]  signature verify
└── index.ts           [A]
```

## Plans SSOT

```
packages/factory/plans/
├── plans-config.ts    [A]  trim to intake.plans_count
├── stripe-prices.ts   [A]  plan id → env STRIPE_PRICE_<X>
├── utils.ts           [A]  getPlanById, isPaidPlan, getTrialEndDate
├── geo-currency.ts    [P2] if multi-currency
└── index.ts           [A]
```

## Limits (if quotas)

```
packages/factory/limits/
├── limits-service.ts  [L]  assertWithinLimit, LimitReachedError, getAllRemainingLimits
└── usage-counters.ts  [L]  countContentsInPeriod, countSeats, ...
```

## Billing state service

```
packages/factory/billing/services/
├── billing-state-service.ts       [A]  wasEventProcessed, recordProcessedStripeEvent, syncSubscriptionToOrg, applySubscriptionDeleted, applyInvoicePaymentFailed, findOrgIdByCustomer
└── billing-recipient-service.ts   [A]  getBillingRecipientForOrg → { email, locale, planName }
```

## Database schemas

```
packages/plugins/database/primary/schemas/
├── stripe-events.ts        [A]  idempotency table
└── <owner-table>.ts        [A]  add columns: plan, planStatus, trialEndsAt[T], currentPeriodStart, currentPeriodEnd, stripeCustomerId, stripeSubscriptionId
```

## Trigger.dev tasks

```
packages/trigger/
├── stripe-send-billing-email.ts   [A]
└── trial-reminders.ts             [T]  daily cron, sweep trialing rows
```

## Email templates

```
packages/plugins/email/templates/billing-templates/
├── subscription-active.tsx        [A]
├── subscription-past-due.tsx      [A]
├── subscription-canceled.tsx      [A]
├── subscription-failed-auth.tsx   [A]
└── trial-reminder.tsx             [T]
```

## API routes

```
app/api/stripe/
├── webhook/route.ts          [A]  copy from references/code/webhook-route.ts
├── checkout/route.ts         [A]  thin wrapper over createHostedCheckoutSession
├── portal/route.ts           [A]
├── subscription/route.ts     [P2] update plan
└── cancel/route.ts           [A]
```

## Admin billing page

```
app/admin/(app)/billing/
├── page.tsx                                 [A]
└── _components/
    ├── billing-overview.tsx                 [A]
    ├── plan-picker.tsx                      [P2]
    ├── usage-card.tsx                       [L]
    ├── cancel-subscription-dialog.tsx       [A]
    └── limit-reached-alert.tsx              [L]
```

## Auth integration

```
packages/plugins/auth/
└── auth-guard.ts             [A]  add requireBillingActive (snippet in references/code/auth-guard-billing.ts)

app/admin/(app)/layout.tsx    [A]  call await requireBillingActive(pathname)
middleware.ts                  [A]  set 'x-pathname' header
```

## Public pricing (if P2)

```
app/(www)/pricing/
├── page.tsx                  [P2]
└── _components/
    └── pricing-tiers.tsx     [P2]  renders from PLAN_IDS
```

## Env

```
.env.local
├── STRIPE_SECRET_KEY                      [A]
├── NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY     [A]
├── STRIPE_WEBHOOK_SECRET                  [A]
└── STRIPE_PRICE_<PLAN>                    [A]  one per PURCHASABLE_PLAN_ID
```

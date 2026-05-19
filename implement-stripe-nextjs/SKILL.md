---
name: implement-stripe-nextjs
description: Use when implementing Stripe subscription billing in a Next.js App Router app. Skill INTERVIEWS the user about plan count, subscription owner (org vs user), trial flow, and limits enforcement BEFORE writing any code, then scaffolds a Stripe plugin (checkout/portal/webhook), plans SSOT, webhook idempotency with Trigger.dev offload, optional 14-day trial gate, optional usage-limit enforcement returning 402 with structured upsell payloads, and locale-aware billing emails. Assumes Drizzle ORM + Trigger.dev + a Better-Auth-style server session helper; lists adaptation points for other stacks. References include the actual production source files from codegus-foundation/Inventra.
---

# Implement Stripe in Next.js

Opinionated end-to-end recipe for adding subscription billing to a Next.js App Router app. Based on the production implementation in `codegus-foundation` (Inventra). Skips decision-making — read `stripe-best-practices` first if you need vendor-API choice guidance.

## STOP — Intake First

**Do not write a single file before collecting these 4 answers via `AskUserQuestion`.** Branching logic below depends on them.

See `references/intake-questions.md` for the exact question payloads. Store answers as:

- `INTAKE.plans_count` ∈ {`1`, `2-3`, `4+`}
- `INTAKE.owner` ∈ {`org`, `user`}
- `INTAKE.trial` ∈ {`yes-14d`, `yes-N`, `no`}
- `INTAKE.limits` ∈ {`quotas`, `features`, `both`}

After collecting answers, echo them back and produce the tailored file checklist from `references/files-tree.md`.

## Stack Assumptions

| Assumption | Swap if different |
|---|---|
| Next.js 16 App Router | Pages Router → put route handlers under `pages/api/stripe/*` instead of `app/api/stripe/*/route.ts` |
| Drizzle ORM + Postgres | Prisma/Kysely → port `references/code/stripe-events-schema.ts` to your ORM's schema syntax |
| Trigger.dev for async work | No background worker → run email dispatch inline in the webhook route (slower 200 response, still works) |
| Better-Auth-style session helper that exposes `session.organization` with `{ plan, planStatus, trialEndsAt }` | Other auth → adapt `references/code/auth-guard-billing.ts`; the helper just needs to read those fields off the current user/org |
| Resend + react-email for transactional email | Other provider → swap `sendEmail` in `stripe-send-billing-email.ts` |
| `@/` path alias rooted at repo | Use whatever alias your project has |

## Architecture

```
Signup
  └─> create owner row { plan: 'trial', planStatus: 'active', trialEndsAt: now+Nd }   [if trial=yes]
  └─> create owner row + force /admin/billing redirect                                  [if trial=no]

User clicks Subscribe
  └─> POST /api/stripe/checkout
        └─> getOrCreateStripeCustomer(ownerId)
        └─> createHostedCheckoutSession(ownerId, planId, urls)
        └─> redirect(session.url)

Stripe payment succeeds
  └─> webhook: customer.subscription.created
        └─> verify signature
        └─> wasEventProcessed? -> 200 duplicate
        └─> syncSubscriptionToOrg(sub)  // writes plan, status, period dates
        └─> recordProcessedStripeEvent(event.id, type)
        └─> tasks.trigger('stripe-send-billing-email', { ownerId, kind: 'active' })
        └─> return 200 (~50ms total)

Quota-consuming mutation                                                                [if limits=quotas|both]
  └─> assertWithinLimit({ ownerId, key: 'contents_per_month' })
        └─> throws LimitReachedError -> route catches -> 402 { code, key, planId, limit, used }
        └─> client renders <LimitReachedAlert /> upsell

Admin page load
  └─> layout calls await requireBillingActive(pathname)
        └─> if planStatus ∈ {past_due, canceled, unpaid} -> redirect /admin/billing
        └─> if plan='trial' && trialEndsAt < now      -> redirect /admin/billing       [if trial=yes]

Daily cron @ 12:00 UTC                                                                  [if trial=yes]
  └─> trial-reminders sweeps orgs with trialEndsAt in {d-3, d-1, d+0} windows
        └─> tasks.trigger('stripe-send-billing-email', { ownerId, kind: 'trial_d3' })
```

## Recipe (15 Steps)

Use `references/files-tree.md` for the full per-intake file list. Each step below tells you what to do and where the canonical reference code lives.

### 1. Install + env vars  `[A]`

```bash
bun add stripe @stripe/stripe-js
# add @stripe/react-stripe-js only if doing embedded checkout
```

In `env.ts` validate:

```ts
STRIPE_SECRET_KEY: z.string(),
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string(),
STRIPE_WEBHOOK_SECRET: z.string(),
// one per purchasable plan:
STRIPE_PRICE_SOLO: z.string(),
STRIPE_PRICE_SCALE: z.string(),
```

If `plans_count=1`, one `STRIPE_PRICE_<PLAN>` env is enough.

### 2. Create Stripe Prices  `[A]`

In Stripe Dashboard, one Product per purchasable plan, one Price per Product. For multi-currency, **add `currency_options` to a single Price** (see `references/plans-ssot.md`) — do NOT create N Prices per plan.

Note the Price IDs in `.env.local`.

### 3. Plans SSOT  `[if plans_count >= 2]`

Copy `references/code/plans-config.ts` to `packages/factory/plans/plans-config.ts` (or your equivalent path). Trim to your N plans. Drop `trial` from `PLAN_IDS` if `INTAKE.trial=no`. Drop `limits` field if `INTAKE.limits=features`.

Create `stripe-prices.ts` that maps `PlanId → env.STRIPE_PRICE_<X>` (snippet in `references/plans-ssot.md`).

### 4. Stripe plugin  `[A]`

Copy `references/code/stripe-plugin/{client,checkout,customer,portal,subscription,webhook,index}.ts` to `packages/plugins/stripe/`. If `INTAKE.owner=user`, rename `orgId` → `userId` and `organizations` table → `users` everywhere.

### 5. DB schema  `[A]`

Add `stripe_event` idempotency table (see `references/code/stripe-events-schema.ts`).

Add subscription columns to the owner table (`organizations` if `owner=org`, `users` if `owner=user`):

```ts
plan: text('plan').notNull().default('trial'),               // 'trial' default only if trial=yes
planStatus: text('plan_status').notNull().default('active'),
trialEndsAt: timestamp('trial_ends_at', { withTimezone: true }),   // omit if trial=no
currentPeriodStart: timestamp('current_period_start', { withTimezone: true }),
currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }),
stripeCustomerId: text('stripe_customer_id').unique(),
stripeSubscriptionId: text('stripe_subscription_id'),
```

Run migrations.

### 6. Webhook route  `[A]`

Copy `references/code/webhook-route.ts` to `app/api/stripe/webhook/route.ts`. Implement the billing-state service it imports (`packages/factory/billing/services/billing-state-service.ts`) with these functions — all owner-table writes:

| Function | Purpose |
|---|---|
| `wasEventProcessed(eventId)` | `SELECT 1 FROM stripe_event WHERE id = $1` |
| `recordProcessedStripeEvent(id, type)` | `INSERT INTO stripe_event (id, type) VALUES ($1, $2)` |
| `syncSubscriptionToOrg(sub)` | Map `sub.customer` → owner row via `stripeCustomerId`; update `plan`, `planStatus`, `currentPeriodStart`, `currentPeriodEnd`, `stripeSubscriptionId`. Return `{ orgId, previousPlanStatus, nextPlanStatus }` |
| `applySubscriptionDeleted(sub)` | Set `planStatus='canceled'`, clear `stripeSubscriptionId` |
| `applyInvoicePaymentFailed(invoice)` | Set `planStatus='past_due'` |
| `findOrgIdByCustomer(customerId)` | Reverse-lookup owner row by `stripeCustomerId` |

### 7. Webhook events  `[A]`

The reference route handles: `customer.subscription.{created,updated,deleted}`, `invoice.payment_failed`, `charge.failed` (filtered by `failure_code`). `invoice.payment_succeeded` is a no-op — `subscription.updated` carries the status flip.

Full matrix + idempotency contract in `references/webhook-events.md`.

### 8. Trigger.dev tasks

- `[A]` Copy `references/code/stripe-send-billing-email.ts` to `packages/trigger/`. Implement `getBillingRecipientForOrg(orgId)` → `{ email, locale, planName }`.
- `[if trial=yes]` Copy `references/code/trial-reminders.ts` to `packages/trigger/`. Cron `0 12 * * *` — runs daily at noon UTC.

### 9. Signup hook  `[if trial=yes]`

In whatever flow creates a new user/org, atomically write:

```ts
{
  plan: 'trial',
  planStatus: 'active',
  trialEndsAt: addDays(new Date(), TRIAL_DURATION_DAYS),
  stripeCustomerId: null,        // lazy
  stripeSubscriptionId: null
}
```

No Stripe API call here. Stripe Customer is created lazily on first `getOrCreateStripeCustomer()`.

If `INTAKE.trial=no`, omit `trialEndsAt`, set `planStatus='unpaid'`, and force redirect to `/admin/billing` on first admin load.

### 10. Billing gate  `[A]`

Add `requireBillingActive(pathname)` to `packages/plugins/auth/auth-guard.ts` from `references/code/auth-guard-billing.ts`. The trial-expired branch fires only `[if trial=yes]`.

Call it from `app/admin/(app)/layout.tsx`:

```ts
const h = await headers();
await requireBillingActive(h.get('x-pathname') ?? '/admin');
```

Set `x-pathname` in `middleware.ts`:

```ts
const res = NextResponse.next();
res.headers.set('x-pathname', req.nextUrl.pathname);
return res;
```

### 11. Limits enforcement  `[if limits=quotas|both]`

Copy `references/code/limits-service.ts` to `packages/factory/limits/`. Implement `usage-counters.ts` with one count function per quota key (`countContentsInPeriod`, `countSeats`, etc. — depends on your domain).

In every quota-consuming API route:

```ts
try {
  await assertWithinLimit({ orgId, key: 'contents_per_month' });
} catch (e) {
  if (e instanceof LimitReachedError) {
    return NextResponse.json(e.toJSON(), { status: 402 });
  }
  throw e;
}
```

The 402 body `{ code, key, planId, limit, used }` is load-bearing — the upsell UI reads these fields.

### 12. `/admin/billing` page  `[A]`

Components (see `references/billing-ui.md`):

| Component | Always? |
|---|---|
| `billing-overview.tsx` | yes |
| `plan-picker.tsx` | `if plans_count >= 2` |
| `usage-card.tsx` | `if limits=quotas|both` |
| `cancel-subscription-dialog.tsx` | yes |
| `limit-reached-alert.tsx` | `if limits=quotas|both` |

Hosted Stripe Checkout (redirect) is the simpler default. For embedded UI use `@stripe/react-stripe-js`'s `<EmbeddedCheckout />` — snippet in `references/billing-ui.md`.

### 13. API routes  `[A]`

Five thin route handlers in `app/api/stripe/`:

```
checkout/route.ts      → createHostedCheckoutSession
portal/route.ts        → createBillingPortalSession
subscription/route.ts  → updateSubscriptionPlan      [if plans_count >= 2]
cancel/route.ts        → stripe.subscriptions.update(id, { cancel_at_period_end: true })
webhook/route.ts       → see step 6
```

All except `webhook` require `requireSession()` and scope to the session's `orgId`/`userId`.

### 14. Pricing page  `[if plans_count >= 2]`

`app/(www)/pricing/page.tsx` renders from `PLAN_IDS`. Currency detection via `getCurrencyFromCountry()` in `packages/factory/plans/geo-currency-server.ts`.

### 15. i18n (recommended)

Every plan tier, status string, and email accepts `locale`. Templates in `references/code/email-templates/` use a `COPY` object keyed by locale. Mirror this in your UI dictionaries.

## Local Testing

```bash
stripe login
stripe listen --forward-to http://localhost:PORT/api/stripe/webhook
# In another terminal:
stripe trigger customer.subscription.created
stripe trigger invoice.payment_failed
stripe trigger charge.failed
```

Test cards (Stripe test mode):

| Card | Behavior |
|---|---|
| `4242 4242 4242 4242` | Happy path |
| `4000 0025 0000 3155` | Requires 3D Secure — fires `failed_auth` |
| `4000 0000 0000 0341` | Card attaches but fails on charge — fires `past_due` |

## Verification Checklist

1. Signup creates owner row with `plan='trial'` and `trialEndsAt` set [`if trial=yes`]
2. Visiting `/admin/*` while on expired trial redirects to `/admin/billing` [`if trial=yes`]
3. Visiting `/admin/*` while `planStatus='past_due'` redirects to `/admin/billing`
4. Clicking Subscribe on `/admin/billing` opens Stripe Checkout
5. After successful test-card payment, owner row flips to `plan='solo'` (or whatever), `planStatus='active'`
6. `subscription-active` email arrives at owner's address in the right locale
7. `stripe_event` table has rows; replaying same event returns 200 with `status: 'duplicate'`
8. Hitting a quota-protected API at the limit returns 402 with `{ code, key, planId, limit, used }` [`if limits=quotas|both`]
9. `<LimitReachedAlert />` renders the upsell with the correct numbers [`if limits=quotas|both`]
10. Billing Portal button opens Stripe's hosted portal
11. Canceling in portal fires `customer.subscription.deleted` → owner row gets `planStatus='canceled'` → `subscription-canceled` email arrives
12. Test card requiring 3DS fires `charge.failed` → owner gets `failed_auth` email [verify failure_code filter works]
13. `trial-reminders` task runs at noon UTC and dispatches emails for orgs in d-3/d-1/d+0 windows [`if trial=yes`]

## What this skill does NOT cover

- **One-time payments** — use `stripe-best-practices` skill instead
- **Marketplaces / Connect** — different API surface entirely
- **Stripe Tax / invoicing add-ons** — orthogonal, layer on after
- **Refunds / disputes UI** — Stripe Portal handles this; don't build it yourself
- **Provisioning Stripe API keys** — use `stripe-projects` skill

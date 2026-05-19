# Webhook Events Matrix

Canonical handler: `references/code/webhook-route.ts`. Idempotency: `references/code/stripe-events-schema.ts`.

## Hot path (always handle)

| Event | Action | Email kind |
|---|---|---|
| `customer.subscription.created` | `syncSubscriptionToOrg(sub)` — write `planId`, `planStatus`, `currentPeriodStart`, `currentPeriodEnd`, `stripeSubscriptionId` to owner row | `active` (if previousStatus !== 'active' && nextStatus === 'active') |
| `customer.subscription.updated` | `syncSubscriptionToOrg(sub)` — same as created; carries plan changes and status flips | `active` or `past_due` depending on transition |
| `customer.subscription.deleted` | `applySubscriptionDeleted(sub)` — set `planStatus='canceled'`, clear `stripeSubscriptionId` | `canceled` |
| `invoice.payment_failed` | `applyInvoicePaymentFailed(invoice)` — set `planStatus='past_due'` | `past_due` |
| `invoice.payment_succeeded` | **no-op** — `subscription.updated` carries the status flip | — |
| `charge.failed` | Only if `failure_code` ∈ {`authentication_required`, `card_declined`, `try_again_later`}. Find owner via `findOrgIdByCustomer(customerId)` | `failed_auth` |

Everything else → log + record processed, no work.

## Idempotency

`stripe_event` table has `id` as PK. Before processing, `wasEventProcessed(event.id)` selects by PK. After successful processing, `recordProcessedStripeEvent(id, type)` inserts. Duplicate inserts fail by PK constraint → reprocessing is impossible.

## Latency budget

Return 200 within ~50ms. Heavy work (emails, downstream sync) goes through Trigger.dev via `tasks.trigger<typeof stripeSendBillingEmail>('stripe-send-billing-email', { orgId, kind })` — fire-and-forget from the route's perspective.

## Test triggers

```bash
stripe listen --forward-to http://localhost:PORT/api/stripe/webhook
stripe trigger customer.subscription.created
stripe trigger customer.subscription.updated
stripe trigger customer.subscription.deleted
stripe trigger invoice.payment_failed
stripe trigger charge.failed
```

Test cards:
- `4242 4242 4242 4242` — happy path
- `4000 0025 0000 3155` — requires 3D Secure (triggers `failed_auth`)
- `4000 0000 0000 0341` — attaches but fails on charge

## Signup → first webhook flow

1. User signs up → app creates owner row with `plan='trial'`, `planStatus='active'`, `trialEndsAt=now+14d`. **No Stripe call yet.**
2. User clicks Subscribe on `/admin/billing` → server route creates Stripe Customer (`getOrCreateStripeCustomer`) and Checkout Session (`createHostedCheckoutSession`) and redirects.
3. After successful payment → Stripe fires `customer.subscription.created` → `syncSubscriptionToOrg` writes `plan='solo'`, `planStatus='active'`, period dates, subscription id.
4. Subsequent renewals → `customer.subscription.updated` with new period dates.

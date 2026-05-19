# Trial Gate + Limits Enforcement

## Trial signup (`if trial=yes`)

On signup, atomically create owner row with:

```ts
{
  plan: 'trial',
  planStatus: 'active',
  trialEndsAt: addDays(new Date(), TRIAL_DURATION_DAYS),
  stripeCustomerId: null,        // created lazily on first checkout
  stripeSubscriptionId: null,
  currentPeriodStart: null,
  currentPeriodEnd: null
}
```

For per-org model: create the org in the same transaction as the user. For per-user model: those fields go on the user row directly.

No Stripe API call at signup. The Stripe Customer is created lazily in `getOrCreateStripeCustomer()` the first time the user clicks Subscribe.

## Trial gate (`if trial=yes`)

`requireBillingActive(pathname)` (see `references/code/auth-guard-billing.ts`) runs in `app/admin/(app)/layout.tsx`:

```ts
import { headers } from 'next/headers';

export default async function AdminLayout({ children }) {
  const h = await headers();
  const pathname = h.get('x-pathname') ?? '/admin';
  await requireBillingActive(pathname);
  return <>{children}</>;
}
```

The `x-pathname` header is set by a Next.js middleware/proxy:

```ts
// middleware.ts
export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  res.headers.set('x-pathname', req.nextUrl.pathname);
  return res;
}
```

Without it, the gate can't redirect-loop-protect on `/admin/billing` itself.

Redirect rules:
- `planStatus` ∈ {`past_due`, `canceled`, `unpaid`} → `/admin/billing`
- `plan === 'trial'` AND `trialEndsAt < now` → `/admin/billing`
- already on `/admin/billing*` → no redirect (avoid loop)

## Limits enforcement (`if limits=quotas|both`)

Service call before any quota-consuming mutation:

```ts
import { assertWithinLimit, LimitReachedError } from '@/packages/factory/limits/limits-service';

export async function POST(req: NextRequest) {
  const session = await requireSession();
  try {
    await assertWithinLimit({ orgId: session.organization.id, key: 'contents_per_month' });
  } catch (error) {
    if (error instanceof LimitReachedError) {
      return NextResponse.json(error.toJSON(), { status: 402 });
    }
    throw error;
  }
  // ... do the work ...
}
```

The 402 body shape is **load-bearing** — the UI's `limit-reached-alert.tsx` reads `code`, `key`, `planId`, `limit`, `used`.

## Period start resolution

`resolvePeriodStart(ctx)` (in `limits-service.ts`):
1. If `currentPeriodStart` set (paid) → use it.
2. Else if `trialEndsAt` set → derive from `trialEndsAt - TRIAL_DURATION_DAYS`.
3. Else → `startOfMonth(now)`.

This ensures `contents_per_month` counts reset on the right boundary whether the user is trialing, paid, or in a weird intermediate state.

## Counters

`packages/factory/limits/usage-counters.ts`:

```ts
export async function countContentsInPeriod(orgId: string, periodStart: Date): Promise<number> {
  const [{ n }] = await db.select({ n: count() })
    .from(contents)
    .where(and(eq(contents.organizationId, orgId), gte(contents.createdAt, periodStart)));
  return n;
}

export async function countSeats(orgId: string): Promise<number> {
  // count members in the org
}
```

Per-org limits in the source repo: `contents_per_month`, `seats`. Add more keys to `PerOrgLimitKey` + `_countForKey` as needed.

// SOURCE: codegus-foundation/packages/plugins/auth/auth-guard.ts
// Just the billing-related helpers. Drop into your existing auth-guard module.
// `requireBillingActive` is called from the admin layout; pathname is read from
// an `x-pathname` request header set by middleware/proxy.

import { redirect } from 'next/navigation';
import { requireSession } from './your-session-helper'; // SWAP for your project

const BILLING_INACTIVE_STATUSES = ['past_due', 'canceled', 'unpaid'] as const;

export function isBillingInactive(planStatus: string | undefined): boolean {
  return BILLING_INACTIVE_STATUSES.includes(
    planStatus as (typeof BILLING_INACTIVE_STATUSES)[number]
  );
}

export function isTrialExpired(
  plan: string | undefined,
  trialEndsAt: Date | null | undefined,
  now: Date = new Date()
): boolean {
  if (plan !== 'trial') return false;
  if (!trialEndsAt) return false;
  return trialEndsAt.getTime() < now.getTime();
}

export async function requireBillingActive(currentPathname: string) {
  if (currentPathname.startsWith('/admin/billing')) return;
  const session = await requireSession(currentPathname);
  if (!session?.organization) return;
  if (isBillingInactive(session.organization.planStatus)) {
    redirect('/admin/billing');
  }
  if (
    isTrialExpired(session.organization.plan, session.organization.trialEndsAt)
  ) {
    redirect('/admin/billing');
  }
}

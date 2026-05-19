// SOURCE: codegus-foundation/packages/plugins/stripe/customer.ts
// Adapt @/ imports. Subscription columns assumed on the `organizations` table —
// if owner=user, swap `organizations` → `users` and rename orgId → userId.

import { eq } from 'drizzle-orm';
import type Stripe from 'stripe';
import { db } from '@/packages/plugins/database/primary/client';
import { organizations } from '@/packages/plugins/database/primary/schemas/organizations';
import { createLoggerClient } from '@/packages/plugins/logger/logger';
import { getStripeClient } from './client';

const logger = createLoggerClient('stripe.customer');

export interface GetOrCreateStripeCustomerParams {
  orgId: string;
}

export async function getOrCreateStripeCustomer(
  params: GetOrCreateStripeCustomerParams
): Promise<{ customerId: string }> {
  const [org] = await db
    .select({
      id: organizations.id,
      name: organizations.name,
      stripeCustomerId: organizations.stripeCustomerId
    })
    .from(organizations)
    .where(eq(organizations.id, params.orgId))
    .limit(1);

  if (!org) {
    throw new Error(`Organization ${params.orgId} not found`);
  }

  if (org.stripeCustomerId) {
    return { customerId: org.stripeCustomerId };
  }

  const stripe = getStripeClient();
  const customer = await stripe.customers.create({
    name: org.name,
    metadata: { organizationId: org.id }
  });

  await db
    .update(organizations)
    .set({ stripeCustomerId: customer.id, updatedAt: new Date() })
    .where(eq(organizations.id, org.id));

  logger.info('Created Stripe customer for organization', {
    orgId: org.id,
    customerId: customer.id
  });

  return { customerId: customer.id };
}

interface OrgBillingIds {
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
}

async function _getOrgBillingIds(orgId: string): Promise<OrgBillingIds | null> {
  const [row] = await db
    .select({
      stripeCustomerId: organizations.stripeCustomerId,
      stripeSubscriptionId: organizations.stripeSubscriptionId
    })
    .from(organizations)
    .where(eq(organizations.id, orgId))
    .limit(1);
  return row ?? null;
}

export async function getSubscriptionIdForOrg(
  orgId: string
): Promise<string | null> {
  const ids = await _getOrgBillingIds(orgId);
  return ids?.stripeSubscriptionId ?? null;
}

export interface DefaultPaymentMethod {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

function _toPaymentMethod(
  pm: Stripe.PaymentMethod | string | null | undefined
): DefaultPaymentMethod | null {
  if (!pm || typeof pm === 'string') return null;
  const card = pm.card;
  if (!card) return null;
  return {
    brand: card.brand,
    last4: card.last4,
    expMonth: card.exp_month,
    expYear: card.exp_year
  };
}

export async function getDefaultPaymentMethod(
  orgId: string
): Promise<DefaultPaymentMethod | null> {
  const ids = await _getOrgBillingIds(orgId);
  if (!ids?.stripeCustomerId) return null;

  const stripe = getStripeClient();
  try {
    const customer = await stripe.customers.retrieve(ids.stripeCustomerId, {
      expand: ['invoice_settings.default_payment_method']
    });

    if (customer.deleted) return null;

    const fromInvoiceSettings = _toPaymentMethod(
      customer.invoice_settings?.default_payment_method
    );
    if (fromInvoiceSettings) return fromInvoiceSettings;

    const list = await stripe.paymentMethods.list({
      customer: ids.stripeCustomerId,
      type: 'card',
      limit: 1
    });
    return _toPaymentMethod(list.data[0]);
  } catch (error) {
    logger.warn('Failed to fetch default payment method', { orgId, error });
    return null;
  }
}

export interface LatestFailedInvoice {
  failedAt: Date;
  declineReason: string;
}

export async function getLatestFailedInvoice(
  orgId: string
): Promise<LatestFailedInvoice | null> {
  const ids = await _getOrgBillingIds(orgId);
  if (!ids?.stripeSubscriptionId) return null;

  const stripe = getStripeClient();
  try {
    const list = await stripe.invoices.list({
      subscription: ids.stripeSubscriptionId,
      limit: 5,
      expand: ['data.last_finalization_error']
    });

    const failed = list.data.find(
      (inv) => inv.attempt_count > 0 && inv.status === 'open'
    );
    if (!failed) return null;

    const failedAt = new Date(
      (failed.status_transitions?.finalized_at ?? failed.created) * 1000
    );
    const declineReason =
      failed.last_finalization_error?.message ??
      failed.last_finalization_error?.decline_code ??
      'Card declined';

    return { failedAt, declineReason };
  } catch (error) {
    logger.warn('Failed to fetch latest failed invoice', { orgId, error });
    return null;
  }
}

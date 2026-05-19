// SOURCE: codegus-foundation/packages/plugins/stripe/checkout.ts
// Adapt @/ imports to your project. Assumes a plans factory exposing `isPaidPlan`
// and a `getStripePriceId(planId)` that maps plan → Stripe Price ID (from env).

import { isPaidPlan, type PlanId } from '@/packages/factory/plans';
import { getStripePriceId } from '@/packages/factory/plans/stripe-prices';
import { createLoggerClient } from '@/packages/plugins/logger/logger';
import { getStripeClient } from './client';
import { getOrCreateStripeCustomer } from './customer';

const logger = createLoggerClient('stripe.checkout');

export interface CreateHostedCheckoutSessionParams {
  orgId: string; // SWAP: rename to ownerId / userId for per-user model
  planId: PlanId;
  successUrl: string;
  cancelUrl: string;
}

export async function createHostedCheckoutSession(
  params: CreateHostedCheckoutSessionParams
): Promise<{ url: string; sessionId: string }> {
  if (!isPaidPlan(params.planId)) {
    throw new Error(`Plan ${params.planId} is not available for checkout`);
  }

  const priceId = getStripePriceId(params.planId);
  const { customerId } = await getOrCreateStripeCustomer({
    orgId: params.orgId
  });

  const stripe = getStripeClient();

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'hosted_page',
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    adaptive_pricing: { enabled: true },
    subscription_data: {
      metadata: {
        organizationId: params.orgId,
        planId: params.planId
      }
    },
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: {
      organizationId: params.orgId,
      planId: params.planId
    }
  });

  if (!session.url) {
    throw new Error('Stripe did not return a url for hosted checkout');
  }

  logger.info('Created hosted checkout session', {
    orgId: params.orgId,
    planId: params.planId,
    sessionId: session.id
  });

  return { url: session.url, sessionId: session.id };
}

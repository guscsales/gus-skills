// SOURCE: codegus-foundation/packages/plugins/stripe/portal.ts

import { createLoggerClient } from '@/packages/plugins/logger/logger';
import { getStripeClient } from './client';
import { getOrCreateStripeCustomer } from './customer';

const logger = createLoggerClient('stripe.portal');

export interface CreateBillingPortalSessionParams {
  orgId: string;
  returnUrl: string;
}

export async function createBillingPortalSession(
  params: CreateBillingPortalSessionParams
): Promise<{ url: string }> {
  const { customerId } = await getOrCreateStripeCustomer({
    orgId: params.orgId
  });

  const stripe = getStripeClient();
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: params.returnUrl
  });

  logger.info('Created billing portal session', {
    orgId: params.orgId,
    customerId
  });

  return { url: session.url };
}

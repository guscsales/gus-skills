// SOURCE: codegus-foundation/packages/plugins/stripe/subscription.ts

import { eq } from 'drizzle-orm';
import type { PlanId } from '@/packages/factory/plans';
import { getStripePriceId } from '@/packages/factory/plans/stripe-prices';
import { db } from '@/packages/plugins/database/primary/client';
import { organizations } from '@/packages/plugins/database/primary/schemas/organizations';
import { createLoggerClient } from '@/packages/plugins/logger/logger';
import { getStripeClient } from './client';

const logger = createLoggerClient('stripe.subscription');

export interface UpdateSubscriptionPlanParams {
  orgId: string;
  planId: PlanId;
}

export async function updateSubscriptionPlan(
  params: UpdateSubscriptionPlanParams
): Promise<{ subscriptionId: string }> {
  const [org] = await db
    .select({ stripeSubscriptionId: organizations.stripeSubscriptionId })
    .from(organizations)
    .where(eq(organizations.id, params.orgId))
    .limit(1);

  if (!org?.stripeSubscriptionId) {
    throw new Error(`Organization ${params.orgId} has no active subscription`);
  }

  const stripe = getStripeClient();
  const subscription = await stripe.subscriptions.retrieve(
    org.stripeSubscriptionId
  );
  const item = subscription.items.data[0];
  if (!item) {
    throw new Error(`Subscription ${org.stripeSubscriptionId} has no items`);
  }

  const newPriceId = getStripePriceId(params.planId);

  await stripe.subscriptions.update(org.stripeSubscriptionId, {
    items: [{ id: item.id, price: newPriceId }],
    proration_behavior: 'none'
  });

  await db
    .update(organizations)
    .set({ plan: params.planId, updatedAt: new Date() })
    .where(eq(organizations.id, params.orgId));

  logger.info('Updated subscription plan', {
    orgId: params.orgId,
    planId: params.planId,
    subscriptionId: org.stripeSubscriptionId
  });

  return { subscriptionId: org.stripeSubscriptionId };
}

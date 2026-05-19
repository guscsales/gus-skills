// SOURCE: codegus-foundation/app/api/stripe/webhook/route.ts
// Pattern: verify signature -> idempotency check via stripe_event PK insert ->
// switch on event.type -> dispatch Trigger.dev email tasks -> return 200 fast.

import { tasks } from '@trigger.dev/sdk/v3';
import { type NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import {
  applyInvoicePaymentFailed,
  applySubscriptionDeleted,
  findOrgIdByCustomer,
  recordProcessedStripeEvent,
  syncSubscriptionToOrg,
  wasEventProcessed
} from '@/packages/factory/billing/services/billing-state-service';
import { createLoggerClient } from '@/packages/plugins/logger/logger';
import {
  StripeSignatureVerificationError,
  verifyAndParse
} from '@/packages/plugins/stripe';
import type { stripeSendBillingEmail } from '@/packages/trigger/stripe-send-billing-email';

const logger = createLoggerClient('stripe-webhook-route');

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get('stripe-signature');

  let event: Stripe.Event;
  try {
    event = verifyAndParse({ rawBody, signature });
  } catch (error) {
    if (error instanceof StripeSignatureVerificationError) {
      logger.warn('Stripe webhook signature failed', { error });
      return NextResponse.json({ error: 'invalid_signature' }, { status: 400 });
    }
    return NextResponse.json({ error: 'parse_failed' }, { status: 400 });
  }

  if (await wasEventProcessed(event.id)) {
    return NextResponse.json({ received: true, status: 'duplicate' });
  }

  try {
    await processStripeEvent(event);
    await recordProcessedStripeEvent(event.id, event.type);
  } catch (error) {
    logger.error('Failed to process Stripe event', {
      eventId: event.id,
      eventType: event.type,
      error
    });
    return NextResponse.json(
      { error: 'process_failed', eventId: event.id },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}

async function processStripeEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const result = await syncSubscriptionToOrg(subscription);
      if (!result) return;
      if (
        result.previousPlanStatus !== 'active' &&
        result.nextPlanStatus === 'active'
      ) {
        await tasks.trigger<typeof stripeSendBillingEmail>(
          'stripe-send-billing-email',
          { orgId: result.orgId, kind: 'active' }
        );
      } else if (result.nextPlanStatus === 'past_due') {
        await tasks.trigger<typeof stripeSendBillingEmail>(
          'stripe-send-billing-email',
          { orgId: result.orgId, kind: 'past_due' }
        );
      }
      return;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const result = await applySubscriptionDeleted(subscription);
      if (!result) return;
      await tasks.trigger<typeof stripeSendBillingEmail>(
        'stripe-send-billing-email',
        { orgId: result.orgId, kind: 'canceled' }
      );
      return;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      const result = await applyInvoicePaymentFailed(invoice);
      if (!result) return;
      await tasks.trigger<typeof stripeSendBillingEmail>(
        'stripe-send-billing-email',
        { orgId: result.orgId, kind: 'past_due' }
      );
      return;
    }

    case 'invoice.payment_succeeded':
      // subscription.updated carries the actual status flip — no-op here.
      return;

    case 'charge.failed': {
      const charge = event.data.object as Stripe.Charge;
      const code = charge.failure_code ?? charge.outcome?.reason ?? '';
      if (
        code !== 'authentication_required' &&
        code !== 'card_declined' &&
        code !== 'try_again_later'
      ) {
        return;
      }
      const customerId =
        typeof charge.customer === 'string'
          ? charge.customer
          : charge.customer?.id;
      if (!customerId) return;
      const orgId = await findOrgIdByCustomer(customerId);
      if (!orgId) return;
      await tasks.trigger<typeof stripeSendBillingEmail>(
        'stripe-send-billing-email',
        { orgId, kind: 'failed_auth' }
      );
      return;
    }

    default:
      logger.info('Unhandled Stripe event, recorded only', {
        eventId: event.id,
        type: event.type
      });
  }
}

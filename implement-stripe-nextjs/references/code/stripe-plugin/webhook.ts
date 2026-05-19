// SOURCE: codegus-foundation/packages/plugins/stripe/webhook.ts
// Signature verification helper. Owner-agnostic; safe to copy as-is.

import type Stripe from 'stripe';
import { env } from '@/env';
import { createLoggerClient } from '@/packages/plugins/logger/logger';
import { getStripeClient } from './client';

const logger = createLoggerClient('stripe.webhook');

export class StripeSignatureVerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StripeSignatureVerificationError';
  }
}

export interface VerifyAndParseParams {
  rawBody: string;
  signature: string | null;
}

export function verifyAndParse(params: VerifyAndParseParams): Stripe.Event {
  if (!params.signature) {
    throw new StripeSignatureVerificationError(
      'Missing Stripe-Signature header'
    );
  }

  if (!env.STRIPE_WEBHOOK_SECRET) {
    throw new StripeSignatureVerificationError(
      'STRIPE_WEBHOOK_SECRET is not set'
    );
  }

  const stripe = getStripeClient();
  try {
    return stripe.webhooks.constructEvent(
      params.rawBody,
      params.signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown error';
    logger.warn('Stripe webhook signature verification failed', { message });
    throw new StripeSignatureVerificationError(message);
  }
}

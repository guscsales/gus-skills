// SOURCE: codegus-foundation/packages/plugins/stripe/client.ts
// Adapt the `@/env` import to your project's env module.

import Stripe from 'stripe';
import { env } from '@/env';

const STRIPE_API_VERSION = '2026-04-22.dahlia' as const;

let _client: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (_client) return _client;
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error(
      'STRIPE_SECRET_KEY is not set — billing features are unavailable'
    );
  }
  _client = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: STRIPE_API_VERSION,
    typescript: true
  });
  return _client;
}

export function _resetStripeClientForTests(): void {
  _client = null;
}

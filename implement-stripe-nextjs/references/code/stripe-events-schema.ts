// SOURCE: codegus-foundation/packages/plugins/database/primary/schemas/stripe-events.ts
// Idempotency table. Stripe event.id is the PK — insert fails on duplicate so
// reprocessing is impossible. `wasEventProcessed(id)` selects by PK before work.

import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const stripeEvents = pgTable(
  'stripe_event',
  {
    id: text('id').primaryKey(),
    type: text('type').notNull(),
    receivedAt: timestamp('received_at', { withTimezone: true })
      .notNull()
      .defaultNow()
  },
  (table) => [index('stripe_event_received_at_idx').on(table.receivedAt)]
);

// Required columns to add to your owner table (organizations OR users):
//
//   plan: text('plan').notNull().default('trial'),
//   planStatus: text('plan_status').notNull().default('active'),
//   trialEndsAt: timestamp('trial_ends_at', { withTimezone: true }),
//   currentPeriodStart: timestamp('current_period_start', { withTimezone: true }),
//   currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }),
//   stripeCustomerId: text('stripe_customer_id').unique(),
//   stripeSubscriptionId: text('stripe_subscription_id'),

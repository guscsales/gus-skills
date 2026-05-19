// SOURCE: codegus-foundation/packages/trigger/trial-reminders.ts
// Daily cron that sweeps trialing orgs and dispatches d-3 / d-1 / d+0 reminders.
// Skip this file entirely if your app has no trial flow.

import { logger, schedules, tasks } from '@trigger.dev/sdk/v3';
import { and, eq, gte, lte } from 'drizzle-orm';
import { db } from '@/packages/plugins/database/primary/client';
import { organizations } from '@/packages/plugins/database/primary/schemas/organizations';
import type { stripeSendBillingEmail } from './stripe-send-billing-email';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

interface ReminderWindow {
  kind: 'trial_d3' | 'trial_d1' | 'trial_ended';
  startOffsetMs: number;
  endOffsetMs: number;
}

const WINDOWS: ReminderWindow[] = [
  { kind: 'trial_d3', startOffsetMs: 3 * ONE_DAY_MS, endOffsetMs: 2 * ONE_DAY_MS },
  { kind: 'trial_d1', startOffsetMs: 1 * ONE_DAY_MS, endOffsetMs: 0 },
  { kind: 'trial_ended', startOffsetMs: 0, endOffsetMs: -1 * ONE_DAY_MS }
];

export const trialReminders = schedules.task({
  id: 'trial-reminders',
  cron: '0 12 * * *',
  maxDuration: 300,
  run: async () => {
    const now = new Date();
    let dispatched = 0;

    for (const window of WINDOWS) {
      const endDate = new Date(now.getTime() + window.endOffsetMs);
      const startDate = new Date(now.getTime() + window.startOffsetMs);

      const rows = await db
        .select({ id: organizations.id })
        .from(organizations)
        .where(
          and(
            eq(organizations.plan, 'trial'),
            gte(organizations.trialEndsAt, endDate),
            lte(organizations.trialEndsAt, startDate)
          )
        );

      for (const row of rows) {
        await tasks.trigger<typeof stripeSendBillingEmail>(
          'stripe-send-billing-email',
          { orgId: row.id, kind: window.kind }
        );
        dispatched += 1;
      }
    }

    logger.info('Trial reminder sweep complete', { dispatched });
    return { dispatched };
  }
});

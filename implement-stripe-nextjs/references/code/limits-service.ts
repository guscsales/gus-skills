// SOURCE: codegus-foundation/packages/factory/limits/limits-service.ts
// Throws LimitReachedError when a quota is hit. API routes catch and return 402
// with `error.toJSON()` so the client UI can render an upsell prompt.

import { startOfMonth, subDays } from 'date-fns';
import { eq } from 'drizzle-orm';
import {
  PLANS,
  type PlanId,
  type PlanLimitKey,
  TRIAL_DURATION_DAYS
} from '@/packages/factory/plans';
import { db } from '@/packages/plugins/database/primary/client';
import { organizations } from '@/packages/plugins/database/primary/schemas/organizations';
import { countContentsInPeriod, countSeats } from './usage-counters';

export class LimitReachedError extends Error {
  code = 'limit_reached' as const;
  key: PlanLimitKey;
  planId: PlanId;
  limit: number;
  used: number;

  constructor(params: {
    key: PlanLimitKey;
    planId: PlanId;
    limit: number;
    used: number;
  }) {
    super(
      `Limit reached for ${params.key} on plan ${params.planId} (used ${params.used} of ${params.limit})`
    );
    this.name = 'LimitReachedError';
    this.key = params.key;
    this.planId = params.planId;
    this.limit = params.limit;
    this.used = params.used;
  }

  toJSON() {
    return {
      code: this.code,
      key: this.key,
      planId: this.planId,
      limit: this.limit,
      used: this.used
    };
  }
}

type PerOrgLimitKey = Extract<PlanLimitKey, 'contents_per_month' | 'seats'>;

function _isPerOrgLimitKey(key: PlanLimitKey): key is PerOrgLimitKey {
  return key === 'contents_per_month' || key === 'seats';
}

export interface OrgPeriodContext {
  planId: PlanId;
  currentPeriodStart: Date | null;
  trialEndsAt: Date | null;
}

async function _resolveOrgContext(orgId: string): Promise<OrgPeriodContext> {
  const [row] = await db
    .select({
      plan: organizations.plan,
      currentPeriodStart: organizations.currentPeriodStart,
      trialEndsAt: organizations.trialEndsAt
    })
    .from(organizations)
    .where(eq(organizations.id, orgId))
    .limit(1);
  if (!row) {
    throw new Error(`Organization ${orgId} not found`);
  }
  return {
    planId: row.plan as PlanId,
    currentPeriodStart: row.currentPeriodStart ?? null,
    trialEndsAt: row.trialEndsAt ?? null
  };
}

export function resolvePeriodStart(ctx: {
  currentPeriodStart: Date | null;
  trialEndsAt: Date | null;
}): Date {
  if (ctx.currentPeriodStart) return ctx.currentPeriodStart;
  if (ctx.trialEndsAt) return subDays(ctx.trialEndsAt, TRIAL_DURATION_DAYS);
  return startOfMonth(new Date());
}

async function _countForKey(
  key: PerOrgLimitKey,
  orgId: string,
  periodStart: Date
): Promise<number> {
  switch (key) {
    case 'contents_per_month':
      return countContentsInPeriod(orgId, periodStart);
    case 'seats':
      return countSeats(orgId);
  }
}

export interface AssertWithinLimitParams {
  orgId: string;
  key: PlanLimitKey;
}

export async function assertWithinLimit(
  params: AssertWithinLimitParams
): Promise<void> {
  const ctx = await _resolveOrgContext(params.orgId);
  const limit = PLANS[ctx.planId].limits[params.key];
  if (limit === null) return;
  if (!_isPerOrgLimitKey(params.key)) return;

  const periodStart = resolvePeriodStart(ctx);
  const used = await _countForKey(params.key, params.orgId, periodStart);
  if (used >= limit) {
    throw new LimitReachedError({
      key: params.key,
      planId: ctx.planId,
      limit,
      used
    });
  }
}

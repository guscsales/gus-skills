# Intake Questions

Before writing ANY code, collect answers to these 4 questions using `AskUserQuestion` (or equivalent). Store answers as `INTAKE.plans_count`, `INTAKE.owner`, `INTAKE.trial`, `INTAKE.limits` and reference them throughout the recipe.

## Question 1 — Plans count

**Q:** How many subscription plans/tiers will this app have?
**Header:** Plans count

| Option | Effect |
|---|---|
| `1` Single plan | No SSOT array. One Stripe Price ID. Skip plan-picker UI + pricing-tier comparison. Skip `PLAN_TIER_RANK`. |
| `2-3` Small lineup | Lightweight SSOT (id + price + limits). Plan-picker UI shows N tiers. |
| `4+` Full lineup | Full SSOT matrix from `references/code/plans-config.ts` with feature keys, highlight flag, optional contact-sales tier. |

## Question 2 — Subscription owner

**Q:** Who owns the subscription in the database?
**Header:** Sub owner

| Option | Effect |
|---|---|
| `org` Per-organization (recommended for multi-tenant) | Subscription columns on the `organizations` table. Every service signature uses `orgId`. Matches the reference code as-is. |
| `user` Per-user (solo apps, no workspaces) | Subscription columns on the `users` table. Rename every `orgId` → `userId` and `organizations` → `users` in copied files. |

## Question 3 — Trial flow

**Q:** Should new signups get a free trial?
**Header:** Trial

| Option | Effect |
|---|---|
| `yes-14d` Yes, 14-day trial (default) | Auto-create owner row with `plan='trial'`, `trialEndsAt=now+14d`. Include `requireBillingActive` trial branch + `trial-reminders` cron + trial-reminder email. |
| `yes-N` Yes, custom duration | Same as 14d but parameterize `TRIAL_DURATION_DAYS`. |
| `no` No trial | Drop `trialEndsAt`, drop trial branch in `requireBillingActive`, drop `trial-reminders.ts`, drop trial-reminder email template. Signup → forces checkout immediately. |

## Question 4 — Limits enforcement

**Q:** How does the plan gate access?
**Header:** Limits

| Option | Effect |
|---|---|
| `quotas` Usage quotas (recommended) | Include `assertWithinLimit` + `LimitReachedError` + 402 payload + `limit-reached-alert` UI + usage counters. |
| `features` Feature gating only | No counters. Plan just unlocks features via boolean checks on `plan`. Skip `limits-service.ts` + `usage_counters` table. |
| `both` Mixed | Quotas for some resources, feature flags for others. Skill includes both pieces. |

## After intake

Echo answers back, then build a tailored file checklist from `references/files-tree.md` using the intake values.

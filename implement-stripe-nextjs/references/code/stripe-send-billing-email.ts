// SOURCE: codegus-foundation/packages/trigger/stripe-send-billing-email.ts
// Trigger.dev task dispatched by the webhook route. One task, many kinds.

import { logger, task } from '@trigger.dev/sdk/v3';
import { env } from '@/env';
import { getBillingRecipientForOrg } from '@/packages/factory/billing/services/billing-recipient-service';
import { sendEmail } from '@/packages/plugins/email/send-email';
import SubscriptionActiveEmail from '@/packages/plugins/email/templates/billing-templates/subscription-active';
import SubscriptionCanceledEmail from '@/packages/plugins/email/templates/billing-templates/subscription-canceled';
import SubscriptionFailedAuthEmail from '@/packages/plugins/email/templates/billing-templates/subscription-failed-auth';
import SubscriptionPastDueEmail from '@/packages/plugins/email/templates/billing-templates/subscription-past-due';
import TrialReminderEmail, {
  type TrialReminderStage
} from '@/packages/plugins/email/templates/billing-templates/trial-reminder';

export type BillingEmailKind =
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'failed_auth'
  | 'trial_d3'
  | 'trial_d1'
  | 'trial_ended';

export interface StripeSendBillingEmailPayload {
  orgId: string;
  kind: BillingEmailKind;
}

const SUBJECT_BY_KIND: Record<BillingEmailKind, { en: string; pt: string }> = {
  active: { en: 'Your plan is active', pt: 'Seu plano está ativo' },
  past_due: { en: 'Payment failed', pt: 'Pagamento não autorizado' },
  canceled: { en: 'Subscription canceled', pt: 'Assinatura cancelada' },
  failed_auth: {
    en: 'Your card needs authorization',
    pt: 'Seu cartão precisa de autorização'
  },
  trial_d3: { en: 'Trial ends in 3 days', pt: 'Teste acaba em 3 dias' },
  trial_d1: { en: 'Trial ends tomorrow', pt: 'Teste acaba amanhã' },
  trial_ended: { en: 'Trial has ended', pt: 'Teste acabou' }
};

const TRIAL_KINDS: Record<string, TrialReminderStage> = {
  trial_d3: 'd3',
  trial_d1: 'd1',
  trial_ended: 'ended'
};

export const stripeSendBillingEmail = task({
  id: 'stripe-send-billing-email',
  maxDuration: 60,
  retry: { maxAttempts: 3 },
  run: async (payload: StripeSendBillingEmailPayload) => {
    const { orgId, kind } = payload;
    logger.info('Sending billing email', { orgId, kind });

    const recipient = await getBillingRecipientForOrg(orgId);
    if (!recipient) return { status: 'skipped', reason: 'no_recipient' };

    const manageUrl = `${env.NEXT_PUBLIC_WEBSITE_URL}/admin/billing`;
    const subject = SUBJECT_BY_KIND[kind][recipient.locale];

    const reactBody = (() => {
      switch (kind) {
        case 'active':
          return SubscriptionActiveEmail({
            locale: recipient.locale,
            planName: recipient.planName,
            manageUrl
          });
        case 'past_due':
          return SubscriptionPastDueEmail({
            locale: recipient.locale,
            planName: recipient.planName,
            manageUrl
          });
        case 'canceled':
          return SubscriptionCanceledEmail({
            locale: recipient.locale,
            planName: recipient.planName,
            manageUrl
          });
        case 'failed_auth':
          return SubscriptionFailedAuthEmail({
            locale: recipient.locale,
            manageUrl
          });
        case 'trial_d3':
        case 'trial_d1':
        case 'trial_ended':
          return TrialReminderEmail({
            locale: recipient.locale,
            stage: TRIAL_KINDS[kind],
            manageUrl
          });
      }
    })();

    await sendEmail({ to: recipient.email, subject, react: reactBody });
    return { status: 'sent' };
  }
});

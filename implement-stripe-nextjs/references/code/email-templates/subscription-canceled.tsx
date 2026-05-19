// SOURCE: codegus-foundation/packages/plugins/email/templates/billing-templates/subscription-canceled.tsx

import { Section, Text } from '@react-email/components';
import { BaseEmail } from '../base-email';
import { ButtonLink } from '../components/button-link';
import type { BillingEmailLocale } from './subscription-active';

interface SubscriptionCanceledEmailProps {
  locale: BillingEmailLocale;
  planName: string;
  manageUrl: string;
}

const COPY = {
  en: {
    title: 'Your subscription has been canceled',
    preview: 'Your subscription has been canceled.',
    intro: (planName: string) =>
      `Your ${planName} subscription has been canceled. You can resubscribe anytime from the dashboard.`,
    cta: 'Reactivate subscription',
    fineprint:
      'Your data is preserved. Resubscribe and pick up exactly where you left off.'
  },
  pt: {
    title: 'Sua assinatura foi cancelada',
    preview: 'Sua assinatura foi cancelada.',
    intro: (planName: string) =>
      `Sua assinatura do plano ${planName} foi cancelada. Você pode reativar quando quiser pelo painel.`,
    cta: 'Reativar assinatura',
    fineprint:
      'Seus dados ficam preservados. Reative quando precisar e continue de onde parou.'
  }
} as const;

export default function SubscriptionCanceledEmail({
  locale,
  planName,
  manageUrl
}: SubscriptionCanceledEmailProps) {
  const copy = COPY[locale];
  return (
    <BaseEmail title={copy.title} preview={copy.preview}>
      <Text className="text-foreground text-base m-0 mb-4">
        {copy.intro(planName)}
      </Text>
      <Section className="mb-6">
        <ButtonLink href={manageUrl}>{copy.cta}</ButtonLink>
      </Section>
      <Text className="text-muted text-sm m-0 mb-4">{copy.fineprint}</Text>
    </BaseEmail>
  );
}

export type { SubscriptionCanceledEmailProps };

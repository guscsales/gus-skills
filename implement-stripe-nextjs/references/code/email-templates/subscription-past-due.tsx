// SOURCE: codegus-foundation/packages/plugins/email/templates/billing-templates/subscription-past-due.tsx

import { Section, Text } from '@react-email/components';
import { BaseEmail } from '../base-email';
import { ButtonLink } from '../components/button-link';
import type { BillingEmailLocale } from './subscription-active';

interface SubscriptionPastDueEmailProps {
  locale: BillingEmailLocale;
  planName: string;
  manageUrl: string;
}

const COPY = {
  en: {
    title: 'Payment failed',
    preview:
      "We couldn't charge your card — please update it to keep your plan.",
    intro: (planName: string) =>
      `We couldn't charge your card for the ${planName} plan. To keep things running, please update your payment method.`,
    cta: 'Update payment method',
    fineprint:
      "We'll retry the charge automatically. If it keeps failing, your subscription will be canceled."
  },
  pt: {
    title: 'Pagamento não autorizado',
    preview:
      'Não conseguimos cobrar seu cartão — atualize para manter seu plano.',
    intro: (planName: string) =>
      `Não conseguimos cobrar seu cartão para o plano ${planName}. Para continuar usando, atualize sua forma de pagamento.`,
    cta: 'Atualizar pagamento',
    fineprint:
      'Vamos tentar cobrar novamente automaticamente. Se continuar falhando, sua assinatura será cancelada.'
  }
} as const;

export default function SubscriptionPastDueEmail({
  locale,
  planName,
  manageUrl
}: SubscriptionPastDueEmailProps) {
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

export type { SubscriptionPastDueEmailProps };

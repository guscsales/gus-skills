// SOURCE: codegus-foundation/packages/plugins/email/templates/billing-templates/subscription-active.tsx
// Locale-aware billing email. Brand name and final copy belong to YOUR app.

import { Section, Text } from '@react-email/components';
import { BaseEmail } from '../base-email';
import { ButtonLink } from '../components/button-link';

export type BillingEmailLocale = 'en' | 'pt';

interface SubscriptionActiveEmailProps {
  locale: BillingEmailLocale;
  planName: string;
  manageUrl: string;
}

const COPY = {
  en: {
    title: 'Your plan is active',
    preview: 'Welcome aboard — your subscription is now active.',
    intro: (planName: string) =>
      `Your ${planName} plan is now active. Thanks for subscribing!`,
    cta: 'Open dashboard',
    fineprint:
      "You'll be billed monthly until you cancel. Manage your subscription anytime from the dashboard."
  },
  pt: {
    title: 'Seu plano está ativo',
    preview: 'Bem-vindo a bordo — sua assinatura está ativa.',
    intro: (planName: string) =>
      `Seu plano ${planName} está ativo. Obrigado por assinar!`,
    cta: 'Abrir painel',
    fineprint:
      'A cobrança é mensal até você cancelar. Gerencie sua assinatura no painel a qualquer momento.'
  }
} as const;

export default function SubscriptionActiveEmail({
  locale,
  planName,
  manageUrl
}: SubscriptionActiveEmailProps) {
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

export type { SubscriptionActiveEmailProps };

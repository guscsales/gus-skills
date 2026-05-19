// SOURCE: codegus-foundation/packages/plugins/email/templates/billing-templates/subscription-failed-auth.tsx
// Dispatched on charge.failed with failure_code in {authentication_required, card_declined, try_again_later}.

import { Section, Text } from '@react-email/components';
import { BaseEmail } from '../base-email';
import { ButtonLink } from '../components/button-link';
import type { BillingEmailLocale } from './subscription-active';

interface SubscriptionFailedAuthEmailProps {
  locale: BillingEmailLocale;
  manageUrl: string;
}

const COPY = {
  en: {
    title: 'Your card needs authorization',
    preview: 'Your bank requested additional authorization.',
    intro:
      'Your bank requires additional authorization (3D Secure) to charge your card. Please complete it from the billing page so your subscription stays active.',
    cta: 'Authorize payment',
    fineprint:
      'No action from us — your bank just needs you to confirm the charge.'
  },
  pt: {
    title: 'Seu cartão precisa de autorização',
    preview: 'Seu banco pediu autorização adicional.',
    intro:
      'Seu banco precisa de autorização adicional (3D Secure) para liberar a cobrança. Conclua a autorização na página de cobrança para manter sua assinatura ativa.',
    cta: 'Autorizar pagamento',
    fineprint:
      'Nada de errado do nosso lado — seu banco só pede que você confirme.'
  }
} as const;

export default function SubscriptionFailedAuthEmail({
  locale,
  manageUrl
}: SubscriptionFailedAuthEmailProps) {
  const copy = COPY[locale];
  return (
    <BaseEmail title={copy.title} preview={copy.preview}>
      <Text className="text-foreground text-base m-0 mb-4">{copy.intro}</Text>
      <Section className="mb-6">
        <ButtonLink href={manageUrl}>{copy.cta}</ButtonLink>
      </Section>
      <Text className="text-muted text-sm m-0 mb-4">{copy.fineprint}</Text>
    </BaseEmail>
  );
}

export type { SubscriptionFailedAuthEmailProps };

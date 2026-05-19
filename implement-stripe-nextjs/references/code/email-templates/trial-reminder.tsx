// SOURCE: codegus-foundation/packages/plugins/email/templates/billing-templates/trial-reminder.tsx
// Single template, three stages (d3 / d1 / ended). Drop this entirely if no trial.

import { Section, Text } from '@react-email/components';
import { BaseEmail } from '../base-email';
import { ButtonLink } from '../components/button-link';
import type { BillingEmailLocale } from './subscription-active';

export type TrialReminderStage = 'd3' | 'd1' | 'ended';

interface TrialReminderEmailProps {
  locale: BillingEmailLocale;
  stage: TrialReminderStage;
  manageUrl: string;
}

const COPY = {
  en: {
    d3: {
      title: 'Your trial ends in 3 days',
      preview:
        'Three days left on your trial — add a card to keep your plan running.',
      intro:
        'Your 14-day trial ends in 3 days. Add a payment method to keep your plan running without interruption.',
      cta: 'Add payment method',
      fineprint: "We won't charge you until the trial ends."
    },
    d1: {
      title: 'Your trial ends tomorrow',
      preview: 'One day left on your trial.',
      intro:
        'Your 14-day trial ends tomorrow. Add a payment method now to avoid losing access.',
      cta: 'Add payment method',
      fineprint:
        'After the trial ends, your account will be locked until you subscribe.'
    },
    ended: {
      title: 'Your trial has ended',
      preview: 'Your trial has ended.',
      intro: 'Your 14-day trial has ended. Subscribe to keep using the app.',
      cta: 'Subscribe now',
      fineprint:
        'Your data is preserved. Pick up where you left off as soon as you subscribe.'
    }
  },
  pt: {
    d3: {
      title: 'Seu teste acaba em 3 dias',
      preview: 'Faltam 3 dias do teste — cadastre um cartão para continuar.',
      intro:
        'Seu teste de 14 dias acaba em 3 dias. Cadastre um cartão para continuar usando seu plano sem interrupção.',
      cta: 'Cadastrar cartão',
      fineprint: 'Não cobramos nada até o teste acabar.'
    },
    d1: {
      title: 'Seu teste acaba amanhã',
      preview: 'Falta 1 dia do teste.',
      intro:
        'Seu teste de 14 dias acaba amanhã. Cadastre um cartão agora para não perder acesso.',
      cta: 'Cadastrar cartão',
      fineprint:
        'Depois que o teste acabar, sua conta fica bloqueada até você assinar.'
    },
    ended: {
      title: 'Seu teste acabou',
      preview: 'Seu teste acabou.',
      intro: 'Seu teste de 14 dias acabou. Assine para continuar usando.',
      cta: 'Assinar agora',
      fineprint:
        'Seus dados ficam preservados. Continue de onde parou assim que assinar.'
    }
  }
} as const;

export default function TrialReminderEmail({
  locale,
  stage,
  manageUrl
}: TrialReminderEmailProps) {
  const copy = COPY[locale][stage];
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

export type { TrialReminderEmailProps };

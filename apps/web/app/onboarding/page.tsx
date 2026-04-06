'use client';

import OnboardingContent from 'apps/web/app/onboarding/OnboardingContent/OnboardingContent';
import type { FeatureCardProps } from 'apps/web/types/Onboarding';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

export default function OnboardingPage() {
  const t = useTranslations('Onboarding');

  const featureCards: FeatureCardProps[] = useMemo(
    () => [
      {
        id: 'onboarding-card-dashboard',
        title: t('steps.dashboard.title'),
        description: t('steps.dashboard.description'),
        badge: t('badges.overview'),
      },
      {
        id: 'onboarding-card-transactions',
        title: t('steps.transactions.title'),
        description: t('steps.transactions.description'),
        badge: t('badges.cashflow'),
      },
      {
        id: 'onboarding-card-categories',
        title: t('steps.categories.title'),
        description: t('steps.categories.description'),
        badge: t('badges.organization'),
      },
      {
        id: 'onboarding-card-charts',
        title: t('steps.charts.title'),
        description: t('steps.charts.description'),
        badge: t('badges.insights'),
      },
      {
        id: 'onboarding-card-budgets',
        title: t('steps.budgets.title'),
        description: t('steps.budgets.description'),
        badge: t('badges.control'),
      },
    ],
    [t],
  );

  return <OnboardingContent features={featureCards} />;
}

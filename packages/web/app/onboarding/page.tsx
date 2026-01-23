'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import OnboardingContent from '@web/app/onboarding/OnboardingContent/OnboardingContent';

import type { FeatureCardProps } from '@web/types/Onboarding';

export default function OnboardingPage() {
  const t = useTranslations('Onboarding');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

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

  if (!isReady) {
    return null;
  }

  return <OnboardingContent features={featureCards} />;
}

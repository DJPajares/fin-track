'use client';

import { useEffect, useMemo, useState, type ComponentType } from 'react';
import { useTranslations } from 'next-intl';
import {
  BarChart3,
  LayoutDashboard,
  ListChecks,
  PiggyBank,
  Wallet,
} from 'lucide-react';
import OnboardingContent from '@web/app/onboarding/OnboardingContent/OnboardingContent';

type FeatureCard = {
  id: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  badge: string;
};

export default function OnboardingPage() {
  const t = useTranslations('Onboarding');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const featureCards: FeatureCard[] = useMemo(
    () => [
      {
        id: 'onboarding-card-dashboard',
        icon: LayoutDashboard,
        title: t('steps.dashboard.title'),
        description: t('steps.dashboard.description'),
        badge: t('badges.overview'),
      },
      {
        id: 'onboarding-card-transactions',
        icon: Wallet,
        title: t('steps.transactions.title'),
        description: t('steps.transactions.description'),
        badge: t('badges.cashflow'),
      },
      {
        id: 'onboarding-card-categories',
        icon: ListChecks,
        title: t('steps.categories.title'),
        description: t('steps.categories.description'),
        badge: t('badges.organization'),
      },
      {
        id: 'onboarding-card-charts',
        icon: BarChart3,
        title: t('steps.charts.title'),
        description: t('steps.charts.description'),
        badge: t('badges.insights'),
      },
      {
        id: 'onboarding-card-budgets',
        icon: PiggyBank,
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

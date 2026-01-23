'use client';

import { useEffect, useMemo, useState, type ComponentType } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  LayoutDashboard,
  ListChecks,
  PiggyBank,
  Wallet,
} from 'lucide-react';
import {
  Onborda,
  OnbordaProvider,
  useOnborda,
  type CardComponentProps,
  type Step,
} from 'onborda';
import { Button } from '@web/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@web/components/ui/card';
import { STORAGE_KEYS } from '@web/constants/storageKeys';
import { cn } from '@web/lib/utils';

type Tour = {
  tour: string;
  steps: Step[];
};

type FeatureCard = {
  id: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  badge: string;
};

function TourCard(
  props: CardComponentProps & { onFinish: () => void; onSkip: () => void },
) {
  const { step, currentStep, totalSteps, nextStep, prevStep, arrow } = props;
  const { onFinish, onSkip } = props;
  const t = useTranslations('Onboarding');
  const { closeOnborda } = useOnborda();
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;

  const getArrowPositionClass = () => {
    switch (step.side) {
      case 'top':
        return '-bottom-2';
      case 'bottom':
        return '-top-2';
      default:
        return '-top-2';
    }
  };

  const handleNext = () => {
    if (isLast) {
      closeOnborda();
      onFinish();
      return;
    }

    nextStep();
  };

  const handleSkip = () => {
    closeOnborda();
    onSkip();
  };

  return (
    <div className="bg-background ring-border/70 relative max-w-md rounded-2xl p-5 shadow-xl ring-1">
      <div className={cn('text-primary absolute', getArrowPositionClass())}>
        {arrow}
      </div>
      <div className="text-muted-foreground flex items-center justify-between gap-3 pb-2 text-xs font-semibold tracking-wide uppercase">
        <span>
          {t('steps.label', {
            current: currentStep + 1,
            total: totalSteps,
          })}
        </span>
        <button
          type="button"
          onClick={handleSkip}
          className="text-muted-foreground hover:text-foreground transition"
        >
          {t('skip')}
        </button>
      </div>
      <div className="space-y-2">
        <div className="text-foreground text-lg font-semibold">
          {step.title}
        </div>
        <div className="text-muted-foreground text-sm">{step.content}</div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={prevStep}
          disabled={isFirst}
          className="min-w-24"
        >
          {t('back')}
        </Button>
        <Button size="sm" className="min-w-30" onClick={handleNext}>
          {isLast ? t('finish') : t('next')}
        </Button>
      </div>
    </div>
  );
}

function OnboardingContent({
  features,
  onStart,
  onSkip,
  hasCompleted,
}: {
  features: FeatureCard[];
  onStart: () => void;
  onSkip: () => void;
  hasCompleted: boolean;
}) {
  const t = useTranslations('Onboarding');

  return (
    <div className="space-y-10">
      <div className="from-primary/10 via-background to-background ring-border/60 flex flex-col gap-4 rounded-3xl bg-linear-to-br p-6 shadow-sm ring-1 sm:flex-row sm:items-center sm:justify-between sm:p-10">
        <div className="space-y-3">
          <p className="text-primary/80 text-sm font-semibold uppercase">
            {t('eyebrow')}
          </p>
          <h1 className="text-3xl leading-tight font-bold sm:text-4xl">
            {t('title')}
          </h1>
          <p className="text-muted-foreground max-w-2xl text-base">
            {t('subtitle')}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button size="lg" onClick={onStart}>
              {t('startTour')}
            </Button>
            <Button variant="ghost" size="lg" onClick={onSkip}>
              {hasCompleted ? t('continueToApp') : t('skip')}
            </Button>
          </div>
        </div>
        <div className="border-border/70 bg-card rounded-2xl border p-5 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-xl">
              <SparklesIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">
                {t('highlight.title')}
              </p>
              <p className="text-foreground text-base font-semibold">
                {t('highlight.value')}
              </p>
              <p className="text-muted-foreground text-xs">
                {t('highlight.caption')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card
              key={feature.id}
              id={feature.id}
              className="border-border/70 flex h-full flex-col justify-between"
            >
              <CardHeader className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="bg-primary/10 text-primary rounded-lg p-2">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                    {feature.badge}
                  </p>
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-muted-foreground text-sm">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-primary flex items-center gap-2 text-sm font-medium">
                <div className="bg-primary h-2 w-2 rounded-full" aria-hidden />
                <span>{t('cta.seeIt')}</span>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <OnbordaProvider>
      <OnboardingPageInner />
    </OnbordaProvider>
  );
}

function OnboardingPageInner() {
  const t = useTranslations('Onboarding');
  const router = useRouter();
  const { startOnborda } = useOnborda();
  const [hasCompleted, setHasCompleted] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const completed =
      localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED) === 'true';
    setHasCompleted(completed);
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

  const tours: Tour[] = useMemo(
    () => [
      {
        tour: 'core',
        steps: [
          {
            icon: null,
            title: t('steps.dashboard.title'),
            content: t('steps.dashboard.tooltip'),
            selector: '#onboarding-card-dashboard',
            side: 'bottom',
            pointerPadding: 18,
            pointerRadius: 18,
          },
          {
            icon: null,
            title: t('steps.transactions.title'),
            content: t('steps.transactions.tooltip'),
            selector: '#onboarding-card-transactions',
            side: 'bottom',
            pointerPadding: 18,
            pointerRadius: 18,
          },
          {
            icon: null,
            title: t('steps.categories.title'),
            content: t('steps.categories.tooltip'),
            selector: '#onboarding-card-categories',
            side: 'bottom',
            pointerPadding: 18,
            pointerRadius: 18,
          },
          {
            icon: null,
            title: t('steps.charts.title'),
            content: t('steps.charts.tooltip'),
            selector: '#onboarding-card-charts',
            side: 'top',
            pointerPadding: 18,
            pointerRadius: 18,
          },
          {
            icon: null,
            title: t('steps.budgets.title'),
            content: t('steps.budgets.tooltip'),
            selector: '#onboarding-card-budgets',
            side: 'top',
            pointerPadding: 18,
            pointerRadius: 18,
          },
        ],
      },
    ],
    [t],
  );

  const handleStart = () => {
    startOnborda('core');
  };

  const handleComplete = () => {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
    setHasCompleted(true);
    router.push('/dashboard');
  };

  const handleSkip = () => {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
    setHasCompleted(true);
    router.push('/dashboard');
  };

  if (!isReady) {
    return null;
  }

  return (
    <Onborda
      steps={tours}
      interact={false}
      shadowRgb="17, 24, 39"
      shadowOpacity="0.25"
      cardComponent={(props) => (
        <TourCard {...props} onFinish={handleComplete} onSkip={handleSkip} />
      )}
    >
      <div className="space-y-8">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-primary/80 text-sm font-semibold">
              {t('topper')}
            </p>
            <h2 className="text-2xl font-bold">{t('headline')}</h2>
            <p className="text-muted-foreground text-sm">{t('description')}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleStart}>
            {hasCompleted ? t('restart') : t('startTour')}
          </Button>
        </div>

        <OnboardingContent
          features={featureCards}
          onStart={handleStart}
          onSkip={handleSkip}
          hasCompleted={hasCompleted}
        />
      </div>
    </Onborda>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={cn('h-6 w-6', className)}
    >
      <path
        d="M12 2l1.9 4.6L18 8.5l-4 1.4L12 14l-2-4.1-4-1.4 4.1-1.9L12 2z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M5 19l1 2 2 1-2-.5-1-2.5z" />
      <path d="M18 17l.8 1.6L20 19l-1-.3-.8-1.7z" />
    </svg>
  );
}

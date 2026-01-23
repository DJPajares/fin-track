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
import { Button } from '@web/components/ui/button';
import { Card, CardHeader, CardTitle } from '@web/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@web/components/ui/carousel';
import { STORAGE_KEYS } from '@web/constants/storageKeys';
import { cn } from '@web/lib/utils';

import { CONSTANTS } from '@shared/constants/common';

type FeatureCard = {
  id: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  badge: string;
};

function OnboardingContent({ features }: { features: FeatureCard[] }) {
  const t = useTranslations('Onboarding');
  const [api, setApi] = useState<CarouselApi>();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!api) return;

    api.on('select', () => {
      setCurrentStep(api.selectedScrollSnap());
    });
  }, [api]);

  const handleNext = () => {
    if (currentStep === features.length - 1) {
      localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
      window.location.href = '/dashboard';
    } else {
      api?.scrollNext();
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      api?.scrollPrev();
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
    window.location.href = '/dashboard';
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      {/* App Name */}
      <div className="text-center">
        <h1 className="text-2xl font-bold">{CONSTANTS.APP_NAME}</h1>
      </div>

      {/* Carousel */}
      <Carousel
        setApi={setApi}
        opts={{ align: 'center' }}
        className="w-full max-w-md"
      >
        <CarouselContent>
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <CarouselItem key={feature.id} className="basis-full">
                <Card className="border-border/70 flex flex-col">
                  <CardHeader className="space-y-4">
                    <div className="flex justify-center">
                      <div className="bg-primary/10 text-primary flex h-16 w-16 items-center justify-center rounded-2xl">
                        <Icon className="h-8 w-8" />
                      </div>
                    </div>
                    <div className="space-y-2 text-center">
                      <CardTitle className="text-2xl">
                        {feature.title}
                      </CardTitle>
                      <p className="text-muted-foreground text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </CardHeader>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      {/* Indicators */}
      <div className="flex justify-center gap-2">
        {features.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              api?.scrollTo(idx);
              setCurrentStep(idx);
            }}
            className={cn(
              'h-2 rounded-full transition-all duration-200',
              idx === currentStep
                ? 'bg-primary w-8'
                : 'bg-muted-foreground/30 w-2',
            )}
            aria-label={`Go to step ${idx + 1}`}
          />
        ))}
      </div>

      {/* Buttons */}
      <div className="w-full">
        <div className="w-full max-w-md">
          <div key={currentStep}>
            {currentStep === 0 && (
              <Button size="lg" className="w-full" onClick={handleNext}>
                {t('getStarted')}
              </Button>
            )}
            {currentStep > 0 && (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={handlePrev}
                >
                  {t('back')}
                </Button>
                <Button size="lg" className="flex-1" onClick={handleNext}>
                  {currentStep === features.length - 1 ? t('done') : t('next')}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="w-full max-w-md">
          <Button
            variant="ghost"
            size="lg"
            className="text-muted-foreground w-full"
            onClick={handleSkip}
          >
            {t('skipForNow')}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return <OnboardingPageInner />;
}

function OnboardingPageInner() {
  const t = useTranslations('Onboarding');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const completed =
      localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED) === 'true';
    if (completed) {
      window.location.href = '/dashboard';
    }
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

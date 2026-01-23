import { ComponentType, useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Button } from '@web/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@web/components/ui/carousel';
import { Label } from '@web/components/ui/label';

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
            return (
              <CarouselItem key={feature.id} className="basis-full">
                <div className="flex flex-col items-center">
                  <div className="relative h-[40vh] w-full max-w-sm overflow-hidden rounded-lg">
                    <div className="to-background pointer-events-none absolute inset-0 z-10 bg-linear-to-b via-transparent" />
                    <Image
                      src={`/images/${feature.id}.webp`}
                      alt={feature.title}
                      fill
                      className="object-contain"
                    />
                  </div>

                  <Label variant="title-xl">{feature.title}</Label>
                  <div className="w-full max-w-xs px-14 text-center leading-none">
                    <Label variant="caption">{feature.description}</Label>
                  </div>
                </div>
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

        <Button
          variant="link"
          size="sm"
          className="w-full"
          onClick={handleSkip}
        >
          <Label variant="caption" className="text-muted-foreground">
            {t('skipForNow')}
          </Label>
        </Button>
      </div>
    </div>
  );
}

export default OnboardingContent;

'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import moment from 'moment';

import { CircularProgress } from '@heroui/react';
import { Button } from '../components/ui/button';
import CardDialog from '../components/shared/CardDialog';

import { useToast } from '../lib/hooks/use-toast';
import { useGetDashboardDataQuery } from '../lib/redux/services/dashboard';
import { useAppSelector } from '../lib/hooks/use-redux';

import { formatCurrency } from '@shared/utilities/formatCurrency';
import { Separator } from '@web/components/ui/separator';

const isMockedData = process.env.NEXT_PUBLIC_USE_MOCKED_DATA === 'true';

const Home = () => {
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations();

  const quotes = t.raw('Page.home.motivation.quotes') as string[]; // Access raw array

  const { currency } = useAppSelector((state) => state.dashboard);

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [fade, setFade] = useState(false);

  const date = new Date();

  const { data: dashboardData } = useGetDashboardDataQuery({
    date,
    currency: currency.name,
  });

  const { data: upcomingDashboardData } = useGetDashboardDataQuery({
    date: moment(date).add(1, 'months'),
    currency: currency.name,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true); // Trigger fade-out

      // Wait for fade-out before updating content
      setTimeout(() => {
        setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        setFade(false); // Trigger fade-in
      }, 500); // Match the animation duration
    }, 8000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  useEffect(() => {
    if (isMockedData) {
      const timeout = setTimeout(() => {
        toast({
          variant: 'destructive',
          title: 'USING MOCKED DATA',
          description:
            "API calls won't work. Adding, modifying, or deleting data within the app will either crash or not work at all.",
        });
      }, 0);

      return () => clearTimeout(timeout);
    }
  }, [toast]);

  return (
    <div className="space-y-6 py-4 sm:space-y-8">
      <div className="grid grid-cols-2 items-start justify-center gap-5 sm:grid-cols-3 sm:gap-10">
        <CardDialog isExpandable>
          <CircularProgress
            classNames={{
              svg: 'w-24 h-24 drop-shadow-md',
              value: 'text-2xl font-semibold',
              indicator: 'stroke-primary',
              label: 'text-center font-extralight tracking-wider',
            }}
            label={t('Page.home.cards.progress.title')}
            value={dashboardData?.main?.paymentCompletionRate * 100 || 0}
            strokeWidth={3}
            showValueLabel={true}
          />
        </CardDialog>

        <CardDialog title="Upcoming extra" isExpandable>
          <h4
            className={`${upcomingDashboardData?.main?.extra < 0 && 'text-destructive'} text-end text-2xl font-bold`}
          >
            {formatCurrency({
              value: upcomingDashboardData?.main?.extra || 0,
              currency: currency.name,
            })}
          </h4>
        </CardDialog>
      </div>

      <Separator />

      <div>
        <CardDialog title={t('Page.home.motivation.title')} isExpandable>
          <h5
            className={`text-lg font-semibold italic transition-opacity duration-500 sm:text-xl ${
              fade ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {`"${quotes[currentQuoteIndex]}"`}
          </h5>
        </CardDialog>
      </div>

      <Button className="my-4 w-full" onClick={() => router.push('/dashboard')}>
        {t('Page.home.dashboardButton')}
      </Button>
    </div>
  );
};

export default Home;

'use client';

import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from '../hooks/use-toast';

const isMockedData = process.env.NEXT_PUBLIC_USE_MOCKED_DATA === 'true';

const Home = () => {
  const router = useRouter();
  const { toast } = useToast();

  const t = useTranslations('Page.home');

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [fade, setFade] = useState(false);

  const quotes = t.raw('motivation.quotes') as string[]; // Access raw array

  useEffect(() => {
    const interval = setInterval(() => {
      // Trigger fade-out
      setFade(true);

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
          description: `API calls won't work. Adding, modifying, or deleting data within the app will either crash or not work at all.`
        });
      }, 0);

      return () => clearTimeout(timeout);

      // setTimeout(() => {
      //   toast({
      //     variant: 'destructive',
      //     title: 'USING MOCKED DATA',
      //     description: `API calls won't work. Adding, modifying, or deleting data within the app will either crash or not work at all.`
      //   });
      // }, 100);
    }
  }, [toast]);

  return (
    <div className="flex flex-col items-center py-2 px-6 sm:px-8 space-y-8 sm:space-y-12">
      <Card className="w-full max-w-md mx-auto flex flex-col justify-between h-44 max-h-40 py-6 px-2 bg-accent/70">
        <p className="text-center text-lg font-semibold sm:text-xl sm:font-bold">
          {t('motivation.title')}
        </p>

        <p
          className={`text-center italic transition-opacity duration-500 ${
            fade ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {`"${quotes[currentQuoteIndex]}"`}
        </p>
      </Card>

      <Button onClick={() => router.push('/dashboard')}>
        {t('dashboardButton')}
      </Button>
    </div>
  );
};

export default Home;

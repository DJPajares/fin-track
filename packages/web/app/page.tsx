'use client';

import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();
  const t = useTranslations('Page.home');

  return (
    <div className="flex flex-col items-center p-10">
      <h1 className="pb-5">{t('greetings')}</h1>
      <Button onClick={() => router.push('/dashboard')}>
        {t('dashboardButton')}
      </Button>
    </div>
  );
};

export default Home;

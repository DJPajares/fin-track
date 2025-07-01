'use client';

import { LoginForm } from '@web/components/Login/login-form';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function Login() {
  const t = useTranslations();
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push('/');
    }
  }, [session, status, router]);

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">
          <div className="flex flex-col items-center justify-center">
            <div className="text-lg font-semibold">
              {t('Page.login.loading')}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Don't render login form if already authenticated
  if (status === 'authenticated') {
    return null;
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 sm:p-10">
      <div className="w-full max-w-sm sm:max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}

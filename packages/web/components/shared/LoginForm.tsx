'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from 'next-themes';

import { Button } from '@web/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@web/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@web/components/ui/field';
import { Input } from '@web/components/ui/input';

import { cn } from '@web/lib/utils';
import { loginSuccess } from '@web/lib/redux/feature/auth/authSlice';
import { login as loginAPI } from '@web/services/auth';
// import { setUserLocale } from '@web/services/locale';
// import { setDashboardCurrency } from '@web/lib/redux/feature/dashboard/dashboardSlice';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const t = useTranslations('Auth.login');
  const router = useRouter();
  const dispatch = useDispatch();
  // const { setTheme } = useTheme();
  const { theme, setTheme } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { user, token } = await loginAPI({ email, password });

      // Update Redux state
      dispatch(
        loginSuccess({
          user,
          session: {
            token,
            expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
          },
        }),
      );

      // Update user settings (if present)
      if (user.settings) {
        // const { language, currency } = user.settings;

        // if (language) setUserLocale(language);

        // if (currency) {
        //   dispatch(setDashboardCurrency({ currency }));
        // }

        if (user.settings?.darkMode !== undefined) {
          setTheme(user.settings.darkMode ? 'dark' : 'light');
        } else if (theme) {
          setTheme(theme);
        }
      }

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      // Handle specific error messages
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        if (axiosError.response?.data?.message) {
          const message = axiosError.response.data.message;
          if (message === 'Email not registered') {
            setError(t('error.emailNotRegistered'));
          } else if (message === 'Incorrect password') {
            setError(t('error.incorrectPassword'));
          } else {
            setError(message);
          }
        } else if (axiosError.message) {
          setError(axiosError.message);
        } else {
          setError(t('error.generic'));
        }
      } else {
        setError(t('error.generic'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                  {error}
                </div>
              )}
              <Field>
                <FieldLabel htmlFor="email">{t('email')}</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">{t('password')}</FieldLabel>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? t('loading') : t('submit')}
                </Button>
                <FieldDescription className="text-center">
                  {t('signupPrompt')}{' '}
                  <Link href="/auth/signup" className="underline">
                    {t('signupLink')}
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

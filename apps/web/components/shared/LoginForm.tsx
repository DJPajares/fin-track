'use client';

import {
  Button,
  Card,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from '@heroui/react';
import { loginSuccess } from '@web/lib/redux/feature/auth/authSlice';
import { setDashboardCurrency } from '@web/lib/redux/feature/dashboard/dashboardSlice';
import { cn } from '@web/lib/utils';
import { fetchCurrencyByName } from '@web/services/api';
import { login as loginAPI } from '@web/services/auth';
import { setUserLocale } from '@web/services/locale';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

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
        const { language, currency } = user.settings;

        if (language) setUserLocale(language);

        if (currency) {
          try {
            const currencyData = await fetchCurrencyByName(currency);
            dispatch(setDashboardCurrency({ currency: currencyData }));
          } catch (error) {
            console.error('Failed to fetch currency:', error);
            // Fallback: set currency with name only
            const dashboardCurrency = { _id: '', name: currency };
            dispatch(setDashboardCurrency({ currency: dashboardCurrency }));
          }
        }

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
        <Card.Header>
          <Card.Title className="text-2xl">{t('title')}</Card.Title>
          <Card.Description>{t('description')}</Card.Description>
        </Card.Header>
        <Card.Content>
          <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            )}
            <TextField name="email" type="email" isRequired>
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                placeholder={t('emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FieldError />
            </TextField>
            <TextField name="password" type="password" isRequired>
              <div className="flex items-center">
                <Label htmlFor="password">{t('password')}</Label>
              </div>
              <Input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FieldError />
            </TextField>
            <div className="flex flex-col gap-2">
              <Button type="submit" isDisabled={isLoading}>
                {isLoading ? t('loading') : t('submit')}
              </Button>
              <p className="text-muted-foreground text-center text-sm">
                {t('signupPrompt')}{' '}
                <Link href="/auth/signkup" className="underline">
                  {t('signupLink')}
                </Link>
              </p>
            </div>
          </Form>
        </Card.Content>
      </Card>
    </div>
  );
}

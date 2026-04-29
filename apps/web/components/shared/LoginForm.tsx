'use client';

import { Button } from '@web/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@web/components/ui/field';
import { Input } from '@web/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@web/components/ui/input-group';
import { loginSuccess } from '@web/lib/redux/feature/auth/authSlice';
import { setDashboardCurrency } from '@web/lib/redux/feature/dashboard/dashboardSlice';
import { cn } from '@web/lib/utils';
import { fetchCurrencyByName } from '@web/services/api';
import { login as loginAPI } from '@web/services/auth';
import { setUserLocale } from '@web/services/locale';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
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
  const { setTheme, theme } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { user, token } = await loginAPI({ email, password });

      dispatch(
        loginSuccess({
          user,
          session: {
            token,
            expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
          },
        }),
      );

      if (user.settings) {
        const { language, currency } = user.settings;

        if (language) setUserLocale(language);

        if (currency) {
          try {
            const currencyData = await fetchCurrencyByName(currency);
            dispatch(
              setDashboardCurrency({
                currency: { _id: currencyData._id, name: currencyData.name },
              }),
            );
          } catch (currencyErr) {
            console.error('Failed to fetch currency:', currencyErr);
            dispatch(
              setDashboardCurrency({ currency: { _id: '', name: currency } }),
            );
          }
        }

        if (user.settings?.darkMode !== undefined) {
          setTheme(user.settings.darkMode ? 'dark' : 'light');
        } else if (theme) {
          setTheme(theme);
        }
      }

      router.push('/dashboard');
    } catch (err) {
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
    <div className={cn('w-full', className)} {...props}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="space-y-6"
      >
        {/* Mobile-only logo (left panel hidden on small screens) */}
        <div className="flex items-center gap-3 lg:hidden">
          <Image
            src="/icons/icon-192x192.png"
            alt="FinTrack"
            width={36}
            height={36}
            className="rounded-xl"
          />
          <span className="font-[--font-sans] text-xl font-bold">FinTrack</span>
        </div>

        <div>
          <h1 className="font-[--font-sans] text-2xl font-semibold">
            {t('title')}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {t('description')}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            {error && <FieldError>{error}</FieldError>}

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
              <FieldLabel htmlFor="password">{t('password')}</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="button"
                    size="icon-sm"
                    aria-label={
                      showPassword ? t('hidePassword') : t('showPassword')
                    }
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </Field>

            <Field>
              <Button type="submit" className="w-full" disabled={isLoading}>
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
      </motion.div>
    </div>
  );
}

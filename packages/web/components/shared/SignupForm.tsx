'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
import { signup } from '@web/services/auth';
import { STORAGE_KEYS } from '@web/constants/storageKeys';

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const t = useTranslations('Auth.signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate password match
    if (password !== confirmPassword) {
      setError(t('error.passwordMismatch'));
      return;
    }

    // Validate password length
    if (password.length < 8) {
      setError(t('error.passwordTooShort'));
      return;
    }

    setIsLoading(true);

    try {
      const result = await signup({ email, password, name });

      // Update Redux state
      dispatch(
        loginSuccess({
          user: result.user,
          session: {
            token: result.token,
            expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
          },
        }),
      );

      // Clear any previous onboarding completion flag so the new user sees the flow
      localStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETED);

      // Redirect to onboarding so the user can start the guided tour
      router.push('/onboarding');
    } catch (err) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        if (axiosError.response?.data?.message) {
          setError(axiosError.response.data.message);
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
                <FieldLabel htmlFor="name">{t('name')}</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder={t('namePlaceholder')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Field>
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
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="confirmPassword">
                  {t('confirmPassword')}
                </FieldLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Field>
              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? t('loading') : t('submit')}
                </Button>
                <FieldDescription className="text-center">
                  {t('loginPrompt')}{' '}
                  <Link href="/auth" className="underline">
                    {t('loginLink')}
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

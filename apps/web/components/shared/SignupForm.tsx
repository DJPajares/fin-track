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
import { cn } from '@web/lib/utils';
import { signup } from '@web/services/auth';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const t = useTranslations('Auth.signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('error.passwordMismatch'));
      return;
    }

    if (password.length < 8) {
      setError(t('error.passwordTooShort'));
      return;
    }

    setIsLoading(true);

    try {
      const result = await signup({ email, password, name });

      dispatch(
        loginSuccess({
          user: result.user,
          session: {
            token: result.token,
            expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
          },
        }),
      );

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
    <div className={cn('w-full', className)} {...props}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="space-y-6"
      >
        {/* Mobile-only logo */}
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
              <InputGroup>
                <InputGroupInput
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
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
              <PasswordStrengthIndicator password={password} />
            </Field>

            <Field>
              <FieldLabel htmlFor="confirmPassword">
                {t('confirmPassword')}
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="button"
                    size="icon-sm"
                    aria-label={
                      showConfirmPassword
                        ? t('hidePassword')
                        : t('showPassword')
                    }
                    onClick={() => setShowConfirmPassword((v) => !v)}
                  >
                    {showConfirmPassword ? (
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
                {t('loginPrompt')}{' '}
                <Link href="/auth" className="underline">
                  {t('loginLink')}
                </Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </motion.div>
    </div>
  );
}

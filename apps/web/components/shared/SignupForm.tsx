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
import { cn } from '@web/lib/utils';
import { signup } from '@web/services/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

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
            <TextField name="name">
              <Label htmlFor="name">{t('name')}</Label>
              <Input
                id="name"
                type="text"
                placeholder={t('namePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <FieldError />
            </TextField>
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
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FieldError />
            </TextField>
            <TextField name="confirmPassword" type="password" isRequired>
              <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
              <Input
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <FieldError />
            </TextField>
            <div className="flex flex-col gap-2">
              <Button type="submit" isDisabled={isLoading}>
                {isLoading ? t('loading') : t('submit')}
              </Button>
              <p className="text-muted-foreground text-center text-sm">
                {t('loginPrompt')}{' '}
                <Link href="/auth" className="underline">
                  {t('loginLink')}
                </Link>
              </p>
            </div>
          </Form>
        </Card.Content>
      </Card>
    </div>
  );
}

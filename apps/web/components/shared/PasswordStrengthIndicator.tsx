'use client';

import { cn } from '@web/lib/utils';
import { useTranslations } from 'next-intl';

interface PasswordStrengthIndicatorProps {
  password: string;
}

type StrengthLevel = 'weak' | 'fair' | 'good' | 'strong';

function calcStrength(password: string): number {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

function strengthLevel(score: number): StrengthLevel {
  if (score <= 1) return 'weak';
  if (score === 2) return 'fair';
  if (score === 3) return 'good';
  return 'strong';
}

const SEGMENT_COLORS: Record<StrengthLevel, string> = {
  weak: 'bg-destructive',
  fair: 'bg-orange-500',
  good: 'bg-yellow-500',
  strong: 'bg-primary',
};

const FILLED_SEGMENTS: Record<StrengthLevel, number> = {
  weak: 1,
  fair: 2,
  good: 3,
  strong: 4,
};

export function PasswordStrengthIndicator({
  password,
}: PasswordStrengthIndicatorProps) {
  const t = useTranslations('Auth.passwordStrength');

  if (!password.length) return null;

  const score = calcStrength(password);
  const level = strengthLevel(score);
  const filled = FILLED_SEGMENTS[level];
  const color = SEGMENT_COLORS[level];

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1" role="presentation">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors duration-300',
              i < filled ? color : 'bg-muted',
            )}
          />
        ))}
      </div>
      <p className="text-muted-foreground text-xs">
        {t('label')}:{' '}
        <span
          className={cn('font-medium', {
            'text-destructive': level === 'weak',
            'text-orange-500': level === 'fair',
            'text-yellow-500': level === 'good',
            'text-primary': level === 'strong',
          })}
        >
          {t(level)}
        </span>
      </p>
    </div>
  );
}

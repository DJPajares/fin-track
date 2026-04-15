import { cn } from '@web/lib/utils';
import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from 'react';

const typographyVariantClasses = {
  body: 'text-foreground text-base leading-7',
  bodySm: 'text-foreground text-sm leading-6',
  caption: 'text-muted-foreground text-xs leading-5',
  cardTitle:
    'text-foreground text-xl leading-tight font-semibold tracking-tight',
  code: 'bg-default text-default-foreground rounded px-1.5 py-0.5 font-mono text-sm leading-5',
  hero: 'text-foreground text-4xl sm:text-5xl lg:text-6xl leading-tight font-extrabold tracking-tight text-balance',
  label: 'text-foreground text-sm leading-5 font-medium',
  lead: 'text-foreground text-lg sm:text-xl leading-8',
  muted: 'text-muted-foreground text-sm leading-6',
  overline:
    'text-muted-foreground text-xs leading-5 font-semibold uppercase tracking-wider',
  pageTitle:
    'text-foreground text-3xl sm:text-4xl leading-tight font-bold tracking-tight text-balance',
  sectionTitle:
    'text-foreground text-2xl sm:text-3xl leading-tight font-semibold tracking-tight',
  subsectionTitle:
    'text-foreground text-lg sm:text-xl leading-snug font-semibold',
} as const;

const typographyDefaultElement = {
  body: 'p',
  bodySm: 'p',
  caption: 'span',
  cardTitle: 'h4',
  code: 'code',
  hero: 'h1',
  label: 'p',
  lead: 'p',
  muted: 'p',
  overline: 'span',
  pageTitle: 'h2',
  sectionTitle: 'h3',
  subsectionTitle: 'h5',
} as const;

type TypographyVariant = keyof typeof typographyVariantClasses;

type TypographyOwnProps<T extends ElementType> = {
  as?: T;
  variant?: TypographyVariant;
  truncate?: boolean;
  className?: string;
  children?: ReactNode;
};

type TypographyProps<T extends ElementType> = TypographyOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof TypographyOwnProps<T>>;

function Typography<T extends ElementType = 'p'>({
  as,
  variant = 'body',
  truncate = false,
  className,
  children,
  ...props
}: TypographyProps<T>) {
  const Component = (as || typographyDefaultElement[variant]) as ElementType;

  return (
    <Component
      className={cn(
        typographyVariantClasses[variant],
        truncate && 'truncate',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

function TypographyHero({
  className,
  ...props
}: Omit<TypographyProps<'h1'>, 'as' | 'variant'>) {
  return <Typography variant="hero" className={className} {...props} />;
}

function TypographyPageTitle({
  className,
  ...props
}: Omit<TypographyProps<'h2'>, 'as' | 'variant'>) {
  return <Typography variant="pageTitle" className={className} {...props} />;
}

function TypographySectionTitle({
  className,
  ...props
}: Omit<TypographyProps<'h3'>, 'as' | 'variant'>) {
  return <Typography variant="sectionTitle" className={className} {...props} />;
}

function TypographyCardTitle({
  className,
  ...props
}: Omit<TypographyProps<'h4'>, 'as' | 'variant'>) {
  return <Typography variant="cardTitle" className={className} {...props} />;
}

function TypographySubsectionTitle({
  className,
  ...props
}: Omit<TypographyProps<'h5'>, 'as' | 'variant'>) {
  return (
    <Typography variant="subsectionTitle" className={className} {...props} />
  );
}

function TypographyLead({
  className,
  ...props
}: Omit<TypographyProps<'p'>, 'as' | 'variant'>) {
  return <Typography variant="lead" className={className} {...props} />;
}

function TypographyBody({
  className,
  ...props
}: Omit<TypographyProps<'p'>, 'as' | 'variant'>) {
  return <Typography variant="body" className={className} {...props} />;
}

function TypographyBodySm({
  className,
  ...props
}: Omit<TypographyProps<'p'>, 'as' | 'variant'>) {
  return <Typography variant="bodySm" className={className} {...props} />;
}

function TypographyMuted({
  className,
  ...props
}: Omit<TypographyProps<'p'>, 'as' | 'variant'>) {
  return <Typography variant="muted" className={className} {...props} />;
}

function TypographyLabel({
  className,
  ...props
}: Omit<TypographyProps<'p'>, 'as' | 'variant'>) {
  return <Typography variant="label" className={className} {...props} />;
}

function TypographyCaption({
  className,
  ...props
}: Omit<TypographyProps<'span'>, 'as' | 'variant'>) {
  return <Typography variant="caption" className={className} {...props} />;
}

function TypographyOverline({
  className,
  ...props
}: Omit<TypographyProps<'span'>, 'as' | 'variant'>) {
  return <Typography variant="overline" className={className} {...props} />;
}

function TypographyCode({
  className,
  ...props
}: Omit<TypographyProps<'code'>, 'as' | 'variant'>) {
  return <Typography variant="code" className={className} {...props} />;
}

export {
  Typography,
  TypographyBody,
  TypographyBodySm,
  TypographyCaption,
  TypographyCardTitle,
  TypographyCode,
  TypographyHero,
  TypographyLabel,
  TypographyLead,
  TypographyMuted,
  TypographyOverline,
  TypographyPageTitle,
  TypographySectionTitle,
  TypographySubsectionTitle,
};
export type { TypographyVariant };

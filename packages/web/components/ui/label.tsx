'use client';

import * as React from 'react';
import { Label as LabelPrimitive } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@web/lib/utils';

const labelVariants = cva(
  'font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  {
    variants: {
      variant: {
        default: 'text-base sm:text-lg',
        title: 'font-semibold text-lg sm:text-xl sm:font-bold',
        title_lg: 'font-bold text-2xl sm:text-3xl sm:font-extrabold',
        title_md: 'font-medium text-lg sm:text-xl sm:font-semibold',
        title_sm: 'font-medium text-base sm:text-lg sm:font-semibold',
        subtitle: 'text-base font-extralight sm:text-lg sm:font-light',
        caption: 'text-xs font-light sm:text-sm sm:font-normal',
        error: 'text-destructive font-semibold',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, variant, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants({ variant }), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };

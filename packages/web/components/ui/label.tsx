'use client';

import * as React from 'react';
import { Label as LabelPrimitive } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@web/lib/utils';

const labelVariants = cva(
  'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
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

function Label({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> &
  VariantProps<typeof labelVariants>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(labelVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Label };

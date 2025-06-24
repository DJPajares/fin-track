'use client';

import * as React from 'react';
import { Label as LabelPrimitive } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@web/lib/utils';

const labelVariants = cva(
  'gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'text-base sm:text-lg',
        title: 'text-xl font-bold sm:text-2xl sm:font-extrabold',
        'title-xl': 'text-3xl font-extrabold sm:text-5xl sm:font-black',
        'title-lg': 'text-2xl font-bold sm:text-3xl sm:font-extrabold',
        'title-md': 'text-lg font-medium sm:text-xl sm:font-semibold',
        'title-sm': 'text-base font-medium sm:text-lg sm:font-semibold',
        subtitle: 'text-base font-extralight sm:text-lg sm:font-light',
        'subtitle-md': 'text-sm font-extralight sm:text-base sm:font-light',
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

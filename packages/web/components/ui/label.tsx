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
        default: 'text-base',
        title: 'text-lg font-medium',
        'title-xl': 'text-2xl font-extrabold',
        'title-lg': 'text-xl font-bold',
        'title-sm': 'text-base font-medium',
        'title-xs': 'text-sm font-medium',
        subtitle: 'text-base font-extralight',
        'subtitle-md': 'text-sm font-extralight',
        caption: 'text-xs font-light',
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

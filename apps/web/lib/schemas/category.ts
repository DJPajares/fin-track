import type { IconProps } from '@web/components/shared/CardIcon';
import { z } from 'zod';

export const categorySchema = z.object({
  _id: z.string(),
  id: z.string(),
  name: z.string(),
  type: z.object({
    _id: z.string(),
    name: z.string(),
  }),
  icon: z.custom<IconProps>(),
  isActive: z.boolean().optional(),
  scope: z.enum(['global', 'custom']),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

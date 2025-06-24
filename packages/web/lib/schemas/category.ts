import { z } from 'zod';
import type { IconProps } from '../../components/shared/CardIcon';

export const categorySchema = z.object({
  _id: z.string(),
  name: z.string(),
  type: z.object({
    _id: z.string(),
    name: z.string(),
  }),
  icon: z.custom<IconProps>(),
  active: z.boolean().optional(),
  serializedName: z.string().optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

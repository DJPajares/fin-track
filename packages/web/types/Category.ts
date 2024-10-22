// import { LucideProps } from 'lucide-react';
// import dynamicIconImports from 'lucide-react/dynamicIconImports';

import type { IconProps } from '@/components/shared/CardIcon';
import type { ListProps } from './List';

// type CardIconProps = LucideProps & {
//   icon: keyof typeof dynamicIconImports;
// };

export type CategoryItemProps = ListProps & {
  icon: IconProps;
  active?: boolean;
};

export type CategoryProps = {
  [key: string]: CategoryItemProps[];
};

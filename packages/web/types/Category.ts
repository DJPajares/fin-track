// import { LucideProps } from 'lucide-react';
// import dynamicIconImports from 'lucide-react/dynamicIconImports';

import type { CardIconProps } from '@/components/shared/CardIcon';
import type { ListProps } from './List';

// type CardIconProps = LucideProps & {
//   icon: keyof typeof dynamicIconImports;
// };

export type CategoryItemProps = ListProps & {
  icon: CardIconProps;
  active: boolean;
};

export type CategoryProps = {
  [key: string]: CategoryItemProps[];
};

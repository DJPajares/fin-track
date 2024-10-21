import {
  // icons,
  // LucideProps,
  ActivityIcon,
  BanknoteIcon,
  BedDoubleIcon,
  ClapperboardIcon,
  CoinsIcon,
  CreditCardIcon,
  DollarSignIcon,
  ShoppingCartIcon,
  UsersIcon
} from 'lucide-react';
// import dynamicIconImports from 'lucide-react/dynamicIconImports';
// import dynamic from 'next/dynamic';

import type { CardIconProps } from '@/types/CardIcon';

const CardIcon = ({ icon }: { icon: CardIconProps }) => {
  const iconClassName = 'h-4 w-4 text-slate-500 dark:text-slate-400';

  switch (icon) {
    case 'activity':
      return <ActivityIcon className={iconClassName} />;
    case 'users':
      return <UsersIcon className={iconClassName} />;
    case 'credit-card':
      return <CreditCardIcon className={iconClassName} />;
    case 'lightbulb':
      return <ActivityIcon className={iconClassName} />;
    case 'clapperboard':
      return <ClapperboardIcon className={iconClassName} />;
    case 'bed-double':
      return <BedDoubleIcon className={iconClassName} />;
    case 'banknote':
      return <BanknoteIcon className={iconClassName} />;
    case 'coins':
      return <CoinsIcon className={iconClassName} />;
    case 'shopping-cart':
      return <ShoppingCartIcon className={iconClassName} />;

    default:
      return <DollarSignIcon className={iconClassName} />;
  }
};

// type CardIconProps = LucideProps & {
//   icon: keyof typeof dynamicIconImports;
// };

// const CardIcon = ({ icon }: CardIconProps) => {
//   const LucideIcon = dynamic(dynamicIconImports[icon]);
//   const className = 'h-4 w-4 text-slate-500 dark:text-slate-400';

//   return <LucideIcon className={className} />;
// };

export default CardIcon;

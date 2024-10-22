import {
  // icons,
  // LucideProps,
  ActivityIcon,
  BanknoteIcon,
  BedDoubleIcon,
  BusFrontIcon,
  ClapperboardIcon,
  CoinsIcon,
  CreditCardIcon,
  DollarSignIcon,
  LightbulbIcon,
  ShoppingCartIcon,
  UsersIcon,
  UtensilsIcon
} from 'lucide-react';
// import dynamicIconImports from 'lucide-react/dynamicIconImports';
// import dynamic from 'next/dynamic';

// type CardIconProps = LucideProps & {
//   icon: keyof typeof dynamicIconImports;
// };

// const CardIcon = ({ icon }: CardIconProps) => {
//   const LucideIcon = dynamic(dynamicIconImports[icon]);
//   const className = 'h-4 w-4 text-slate-500 dark:text-slate-400';

//   return <LucideIcon className={className} />;
// };

export const iconMap = {
  activity: ActivityIcon,
  users: UsersIcon,
  'credit-card': CreditCardIcon,
  lightbulb: LightbulbIcon,
  clapperboard: ClapperboardIcon,
  'bed-double': BedDoubleIcon,
  banknote: BanknoteIcon,
  coins: CoinsIcon,
  'shopping-cart': ShoppingCartIcon,
  utensils: UtensilsIcon,
  'bus-front': BusFrontIcon,
  default: DollarSignIcon // Default case
} as const;

export type IconProps = keyof typeof iconMap;

type CardIconProps = {
  icon: IconProps;
};

const CardIcon = ({ icon }: CardIconProps) => {
  const IconComponent = iconMap[icon] || iconMap.default;
  const iconClassName = 'h-4 w-4';

  return <IconComponent className={iconClassName} />;
};

export default CardIcon;

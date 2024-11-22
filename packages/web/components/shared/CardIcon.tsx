import {
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
  default: DollarSignIcon
} as const;

export type IconProps = keyof typeof iconMap;

type CardIconProps = {
  icon?: IconProps;
};

const CardIcon = ({ icon = 'default' }: CardIconProps) => {
  const IconComponent = iconMap[icon];
  const iconClassName = 'h-4 w-4';

  return <IconComponent className={iconClassName} />;
};

export default CardIcon;

import { cn } from '../../lib/utils';
import {
  ActivityIcon,
  BanknoteIcon,
  BedDoubleIcon,
  BriefcaseBusinessIcon,
  BusFrontIcon,
  ClapperboardIcon,
  CoinsIcon,
  CreditCardIcon,
  DollarSignIcon,
  HandCoinsIcon,
  LightbulbIcon,
  PiggyBankIcon,
  ShoppingCartIcon,
  UsersIcon,
  UtensilsIcon,
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
  'piggy-bank': PiggyBankIcon,
  'hand-coins': HandCoinsIcon,
  'briefcase-business': BriefcaseBusinessIcon,
  default: DollarSignIcon,
} as const;

export type IconProps = keyof typeof iconMap;

type CardIconProps = {
  icon?: IconProps;
  className?: string;
};

const CardIcon = ({ icon = 'default', className }: CardIconProps) => {
  const IconComponent = iconMap[icon];
  const iconClassName = 'h-4 w-4';

  return <IconComponent className={cn(iconClassName, className)} />;
};

export default CardIcon;

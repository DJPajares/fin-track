import { cn } from '../../lib/utils';
import {
  ActivityIcon,
  BabyIcon,
  BanknoteIcon,
  BedDoubleIcon,
  BookOpenIcon,
  BriefcaseIcon,
  BriefcaseBusinessIcon,
  BusFrontIcon,
  CarIcon,
  ClapperboardIcon,
  CoinsIcon,
  CreditCardIcon,
  DropletIcon,
  DumbbellIcon,
  DollarSignIcon,
  FuelIcon,
  Gamepad2Icon,
  GiftIcon,
  HandCoinsIcon,
  HeartIcon,
  HomeIcon,
  LandmarkIcon,
  LaptopIcon,
  LightbulbIcon,
  MusicIcon,
  PawPrintIcon,
  PiggyBankIcon,
  PlaneIcon,
  PlugIcon,
  PopcornIcon,
  ReceiptIcon,
  ShieldIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  SmartphoneIcon,
  StethoscopeIcon,
  TicketIcon,
  UtensilsCrossedIcon,
  UsersIcon,
  UtensilsIcon,
  WifiIcon,
  WrenchIcon,
  ZapIcon,
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
  'shopping-bag': ShoppingBagIcon,
  utensils: UtensilsIcon,
  'bus-front': BusFrontIcon,
  'piggy-bank': PiggyBankIcon,
  'hand-coins': HandCoinsIcon,
  briefcase: BriefcaseIcon,
  'briefcase-business': BriefcaseBusinessIcon,
  baby: BabyIcon,
  book: BookOpenIcon,
  car: CarIcon,
  droplet: DropletIcon,
  dumbbell: DumbbellIcon,
  fuel: FuelIcon,
  gamepad: Gamepad2Icon,
  gift: GiftIcon,
  heart: HeartIcon,
  home: HomeIcon,
  landmark: LandmarkIcon,
  laptop: LaptopIcon,
  plane: PlaneIcon,
  music: MusicIcon,
  paw: PawPrintIcon,
  plug: PlugIcon,
  popcorn: PopcornIcon,
  receipt: ReceiptIcon,
  shield: ShieldIcon,
  smartphone: SmartphoneIcon,
  stethoscope: StethoscopeIcon,
  ticket: TicketIcon,
  'utensils-crossed': UtensilsCrossedIcon,
  wifi: WifiIcon,
  wrench: WrenchIcon,
  zap: ZapIcon,
  default: DollarSignIcon,
} as const;

export type IconProps = keyof typeof iconMap;

type CardIconProps = {
  icon?: IconProps;
  className?: string;
};

const CardIcon = ({ icon = 'default', className }: CardIconProps) => {
  const IconComponent = iconMap[icon];
  const iconClassName = 'size-4';

  return <IconComponent className={cn(iconClassName, className)} />;
};

export default CardIcon;

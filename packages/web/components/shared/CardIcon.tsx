import {
  ActivityIcon,
  BanknoteIcon,
  BedDoubleIcon,
  ClapperboardIcon,
  CoinsIcon,
  CreditCardIcon,
  DollarSignIcon,
  UsersIcon
} from 'lucide-react';
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

    default:
      return <DollarSignIcon className={iconClassName} />;
  }
};

export default CardIcon;

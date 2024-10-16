import {
  ActivityIcon,
  BedDoubleIcon,
  ClapperboardIcon,
  CreditCardIcon,
  DollarSignIcon,
  UsersIcon
} from 'lucide-react';

export type CardIconProps =
  | 'activity'
  | 'users'
  | 'credit-card'
  | 'lightbulb'
  | 'clapperboard'
  | 'bed-double'
  | undefined;

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

    default:
      return <DollarSignIcon className={iconClassName} />;
  }
};

export default CardIcon;

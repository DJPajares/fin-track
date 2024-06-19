import {
  ActivityIcon,
  BedDoubleIcon,
  ClapperboardIcon,
  CreditCardIcon,
  DollarSignIcon,
  UsersIcon
} from 'lucide-react';

type CardIconProps = {
  icon: string;
};

const CardIcon = ({ icon }: CardIconProps) => {
  const iconClassName = 'h-4 w-4 text-slate-500 dark:text-slate-400';

  if (icon === 'activity') {
    return <ActivityIcon className={iconClassName} />;
  } else if (icon === 'users') {
    return <UsersIcon className={iconClassName} />;
  } else if (icon === 'credit-card') {
    return <CreditCardIcon className={iconClassName} />;
  } else if (icon === 'lightbulb') {
    return <ActivityIcon className={iconClassName} />;
  } else if (icon === 'clapperboard') {
    return <ClapperboardIcon className={iconClassName} />;
  } else if (icon === 'bed-double') {
    return <BedDoubleIcon className={iconClassName} />;
  } else {
    return <DollarSignIcon className={iconClassName} />;
  }
};

export default CardIcon;

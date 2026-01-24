import CardIcon, { IconProps } from '@web/components/shared/CardIcon';
import { cn } from '@web/lib/utils';

export default function CardButton({
  label,
  handleOnClick,
  isActive,
  size,
  icon,
}: {
  label: string;
  handleOnClick: () => void;
  isActive: boolean;
  size?: 'sm' | 'md' | 'lg';
  icon?: IconProps;
}) {
  return (
    <button
      type="button"
      onClick={handleOnClick}
      aria-pressed={isActive}
      className={cn(
        `flex cursor-pointer items-center rounded-2xl border text-sm font-semibold transition-colors ${size === 'lg' ? 'p-4' : size === 'md' ? 'p-3' : 'p-2'}`,
        isActive
          ? 'border-primary bg-primary/10 text-primary hover:bg-background/10 shadow-sm'
          : 'border-border/70 bg-background text-muted-foreground hover:bg-primary/10',
      )}
    >
      <div
        className={`${icon ? 'flex flex-row items-center justify-start gap-3' : 'justify-center'} w-full`}
      >
        {icon && <CardIcon icon={icon} className="size-5" />}

        <p className="truncate text-sm leading-tight font-semibold">{label}</p>
      </div>
    </button>
  );
}

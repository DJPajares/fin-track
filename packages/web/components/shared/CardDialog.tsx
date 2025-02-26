import { ReactNode } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../components/ui/dialog';
import { Card } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { cn } from '@web/lib/utils';

type CardDialogProps = {
  title?: string;
  isExpandable?: boolean;
  children: ReactNode;
  className?: string;
};
const CardDialog = ({
  title,
  isExpandable = false,
  children,
  className,
}: CardDialogProps) => {
  return (
    <Card
      className={cn(
        `bg-accent/70 flex h-44 w-full flex-col justify-between ${isExpandable && 'cursor-pointer'}`,
        className,
      )}
    >
      <div className="m-auto flex flex-col justify-between gap-4 p-4">
        {title && (
          <Label variant="subtitle" className="capitalize tracking-wider">
            {title}
          </Label>
        )}

        {isExpandable ? (
          <Dialog>
            <DialogTrigger asChild>
              <div className={`${title && 'my-2'}`}>{children}</div>
            </DialogTrigger>

            <DialogContent className="max-w-xs justify-center">
              <DialogHeader>
                <DialogTitle className="font-extralight tracking-wider">
                  {title}
                </DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>

              {children}
            </DialogContent>
          </Dialog>
        ) : (
          <div className={`${title && 'my-2'}`}>{children}</div>
        )}
      </div>
    </Card>
  );
};

export default CardDialog;

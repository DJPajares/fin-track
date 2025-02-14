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

type CardDialogProps = {
  title?: string;
  isExpandable?: boolean;
  children: ReactNode;
};
const CardDialog = ({
  title,
  isExpandable = false,
  children,
}: CardDialogProps) => {
  return (
    <Card
      className={`bg-accent/70 flex h-44 w-full flex-col justify-between ${isExpandable && 'cursor-pointer'}`}
    >
      <div className="m-auto flex flex-col justify-between gap-4 p-4">
        {title && (
          <p className="font-extralight capitalize tracking-wider">{title}</p>
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

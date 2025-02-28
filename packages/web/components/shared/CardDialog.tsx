import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../components/ui/dialog';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';

type CardDialogProps = {
  title?: string;
  isExpandable?: boolean;
  children: ReactNode;
  className?: string;
};

const Content = ({ title, isExpandable, children }: CardDialogProps) =>
  isExpandable ? (
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
  );

const CardDialog = ({
  title,
  isExpandable = false,
  children,
  className,
}: CardDialogProps) => {
  return (
    <Card
      className={cn(
        `bg-accent/70 flex h-44 w-full flex-col ${isExpandable && 'cursor-pointer'}`,
        className,
      )}
    >
      {title ? (
        <>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>

          <CardContent>
            <Content isExpandable={isExpandable} title={title}>
              {children}
            </Content>
          </CardContent>
        </>
      ) : (
        <div className="m-auto flex flex-col justify-between gap-4 p-4">
          <Content isExpandable={isExpandable} title={title}>
            {children}
          </Content>
        </div>
      )}
    </Card>
  );
};

export default CardDialog;

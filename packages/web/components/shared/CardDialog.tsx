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
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Label } from '@web/components/ui/label';

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
    <Card className={cn(`${isExpandable && 'cursor-pointer'}`, className)}>
      {title ? (
        <>
          <CardHeader>
            <Label variant="title-xs">{title}</Label>
          </CardHeader>

          <CardContent>
            <Content isExpandable={isExpandable} title={title}>
              {children}
            </Content>
          </CardContent>
        </>
      ) : (
        <CardContent>
          <Content isExpandable={isExpandable} title={title}>
            {children}
          </Content>
        </CardContent>
      )}
    </Card>
  );
};

export default CardDialog;

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@web/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@web/components/ui/dialog';
import { cn } from '@web/lib/utils';
import { ReactNode } from 'react';

import { TypographyMuted } from './Typography';

type CardDialogProps = {
  title?: string;
  description?: string;
  isExpandable?: boolean;
  children: ReactNode;
  className?: string;
};

const Content = ({ title, isExpandable, children }: CardDialogProps) =>
  isExpandable ? (
    <Dialog>
      <DialogTrigger
        render={<div className={`${title && 'my-2'}`}>{children}</div>}
      />

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
  description,
  isExpandable = false,
  children,
  className,
}: CardDialogProps) => {
  return (
    <Card className={cn(`${isExpandable && 'cursor-pointer'}`, className)}>
      {title ? (
        <>
          <CardHeader className="px-4">
            <CardDescription>{title}</CardDescription>
            {description && (
              <CardDescription>
                <TypographyMuted>{description}</TypographyMuted>
              </CardDescription>
            )}
          </CardHeader>

          <CardContent className="px-4">
            <Content isExpandable={isExpandable} title={title}>
              {children}
            </Content>
          </CardContent>
        </>
      ) : (
        <CardContent className="px-4">
          <Content isExpandable={isExpandable} title={title}>
            {children}
          </Content>
        </CardContent>
      )}
    </Card>
  );
};

export default CardDialog;

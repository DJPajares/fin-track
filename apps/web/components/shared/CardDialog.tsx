import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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

type CardDialogProps = {
  title?: string;
  description?: string;
  isExpandable?: boolean;
  children: ReactNode;
  className?: string;
};

const Content = ({
  title,
  description,
  isExpandable,
  children,
}: CardDialogProps) =>
  isExpandable ? (
    <Dialog>
      <DialogTrigger className="w-full">
        <div className={`${title && 'my-2'}`}>{children}</div>
      </DialogTrigger>

      <DialogContent className="max-w-xs justify-center">
        <DialogHeader>
          <DialogTitle className="font-extralight tracking-wider">
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
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
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>

          <CardContent>
            <Content
              isExpandable={isExpandable}
              title={title}
              description={description}
            >
              {children}
            </Content>
          </CardContent>
        </>
      ) : (
        <CardContent className="px-4">
          <Content
            isExpandable={isExpandable}
            title={title}
            description={description}
          >
            {children}
          </Content>
        </CardContent>
      )}
    </Card>
  );
};

export default CardDialog;

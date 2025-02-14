import { ReactNode } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../components/ui/dialog';
// import { Card, CardBody, CardHeader } from '@heroui/react';
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
  // return (
  //   <Card className="bg-accent/70 h-40 cursor-pointer">
  //     {title && (
  //       <CardHeader>
  //         <p className="font-semibold sm:text-lg sm:font-bold">{title}</p>
  //       </CardHeader>
  //     )}

  //     {isExpandable ? (
  //       <Dialog>
  //         <DialogTrigger asChild>
  //           <CardContent>{children}</CardContent>
  //           {/* <CardBody>{children}</CardBody> */}
  //         </DialogTrigger>

  //         <DialogContent className="max-w-xs">
  //           {title && (
  //             <DialogHeader>
  //               <DialogTitle>{title}</DialogTitle>
  //               <DialogDescription></DialogDescription>
  //             </DialogHeader>
  //           )}

  //           {children}
  //         </DialogContent>
  //       </Dialog>
  //     ) : (
  //       <CardContent>{children}</CardContent>
  //       // <CardBody>{children}</CardBody>
  //     )}
  //   </Card>
  // );

  return (
    <Card className="bg-accent/70 flex h-44 w-full flex-col justify-between">
      {/* <div
      // className={`bg-accent/70 border-1 border-border h-44 rounded-lg shadow-md sm:h-52 ${isExpandable ? 'cursor-pointer' : 'cursor-default'}`}
      className={`bg-accent/70 border-1 border-border h-44 w-full rounded-lg shadow-md sm:h-52 ${isExpandable ? 'cursor-pointer' : 'cursor-default'}`}
    > */}
      <div className="m-auto flex flex-col justify-between gap-4 p-4">
        {title && (
          <p className="font-semibold sm:text-lg sm:font-bold">{title}</p>
        )}

        {isExpandable ? (
          <Dialog>
            <DialogTrigger asChild>
              <div className={`${title && 'my-2'}`}>{children}</div>
            </DialogTrigger>

            <DialogContent className="max-w-xs">
              {title ? (
                <DialogHeader>
                  <DialogTitle>{title}</DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>
              ) : (
                <DialogHeader>
                  <DialogTitle>Title</DialogTitle>
                  <DialogDescription>Description</DialogDescription>
                </DialogHeader>
              )}

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

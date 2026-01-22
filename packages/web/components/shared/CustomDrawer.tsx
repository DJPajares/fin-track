import { Dispatch, ReactNode, SetStateAction, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useIsMobile } from '../../lib/hooks/use-mobile';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer';
import { Button } from '../ui/button';
import ConfirmationDialog from './ConfirmationDialog';
import { Separator } from '../ui/separator';
import Loader from './Loader';

type CustomDrawerProps = {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  title?: string;
  description?: string;
  okButtonLabel?: string;
  cancelButtonLabel?: string;
  children: ReactNode;
  triggerChildren?: ReactNode;
  handleSubmit: () => void | Promise<void>;
};

const CustomDrawer = ({
  open,
  onOpenChange,
  title,
  description,
  okButtonLabel,
  cancelButtonLabel,
  children,
  triggerChildren,
  handleSubmit,
}: CustomDrawerProps) => {
  const isMobile = useIsMobile();
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitWithLoading = async () => {
    setIsLoading(true);
    try {
      await handleSubmit();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}

      {isMobile ? (
        <Drawer open={open} onOpenChange={onOpenChange}>
          {triggerChildren && (
            <DrawerTrigger asChild>{triggerChildren}</DrawerTrigger>
          )}

          <DrawerContent aria-describedby="">
            <div className="mx-auto flex min-h-0 w-full flex-1 flex-col">
              <DrawerHeader className="p-2">
                <div className="grid grid-cols-3 items-center gap-2">
                  <div className="justify-self-start">
                    <ConfirmationDialog handleSubmit={handleSubmitWithLoading}>
                      <Button variant="ghost" disabled={isLoading}>
                        {okButtonLabel || t('Common.button.save')}
                      </Button>
                    </ConfirmationDialog>
                  </div>

                  <div className="justify-self-center text-center">
                    <DrawerTitle>{title}</DrawerTitle>
                  </div>

                  <div className="justify-self-end">
                    <Button
                      variant="ghost"
                      onClick={() => onOpenChange(!open)}
                      disabled={isLoading}
                    >
                      {cancelButtonLabel || t('Common.button.cancel')}
                    </Button>
                  </div>
                </div>
              </DrawerHeader>

              <Separator className="shrink-0" />

              <div className="flex-1 overflow-y-auto p-4">{children}</div>
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerTrigger asChild>{triggerChildren}</DrawerTrigger>

          <DrawerContent aria-describedby={description}>
            <div className="mx-auto flex w-full max-w-sm flex-1 flex-col overflow-hidden">
              <DrawerHeader>
                <DrawerTitle>{title}</DrawerTitle>
                <DrawerDescription>{description}</DrawerDescription>
              </DrawerHeader>

              <Separator />

              <div className="flex-1 overflow-y-auto p-4">{children}</div>
            </div>

            <DrawerFooter className="mx-auto w-full max-w-sm">
              <ConfirmationDialog handleSubmit={handleSubmitWithLoading}>
                <Button disabled={isLoading}>
                  {okButtonLabel || t('Common.button.ok')}
                </Button>
              </ConfirmationDialog>

              <DrawerClose asChild>
                <Button variant="outline" disabled={isLoading}>
                  {cancelButtonLabel || t('Common.button.cancel')}
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default CustomDrawer;

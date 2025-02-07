import { Dispatch, ReactNode, SetStateAction } from 'react';
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

type CustomDrawerProps = {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  title?: string;
  description?: string;
  okButtonLabel?: string;
  cancelButtonLabel?: string;
  children: ReactNode;
  triggerChildren?: ReactNode;
  handleSubmit: () => void;
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

  return (
    <>
      {isMobile ? (
        <Drawer open={open} onOpenChange={onOpenChange}>
          {triggerChildren && (
            <DrawerTrigger asChild>{triggerChildren}</DrawerTrigger>
          )}

          <DrawerContent className="h-[97%]" aria-describedby="">
            <div className="mx-auto w-full max-w-sm">
              <div className="flex flex-row items-center justify-between py-2">
                <ConfirmationDialog handleSubmit={handleSubmit}>
                  <Button variant="ghost">
                    {okButtonLabel || t('Common.button.save')}
                  </Button>
                </ConfirmationDialog>

                <div className="absolute left-1/2 -translate-x-1/2 transform">
                  <DrawerTitle>{title}</DrawerTitle>
                </div>

                <Button variant="ghost" onClick={() => onOpenChange(!open)}>
                  {cancelButtonLabel || t('Common.button.cancel')}
                </Button>
              </div>

              <Separator />

              <div className="py-6">{children}</div>
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerTrigger asChild>{triggerChildren}</DrawerTrigger>

          <DrawerContent aria-describedby={description}>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>{title}</DrawerTitle>
                <DrawerDescription>{description}</DrawerDescription>
              </DrawerHeader>

              <Separator />

              <div className="overflow-auto py-4">{children}</div>
            </div>

            <DrawerFooter className="mx-auto w-full max-w-sm">
              <ConfirmationDialog handleSubmit={handleSubmit}>
                <Button>{okButtonLabel || t('Common.button.ok')}</Button>
              </ConfirmationDialog>

              <DrawerClose asChild>
                <Button variant="outline">
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

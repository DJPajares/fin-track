import { Button } from '@web/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@web/components/ui/drawer';
import { useIsMobile } from '@web/lib/hooks/use-mobile';
import { useTranslations } from 'next-intl';
import { Dispatch, ReactNode, SetStateAction, useState } from 'react';

import ConfirmationDialog from './ConfirmationDialog';
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
  onCancel?: () => void;
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
  onCancel,
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

  const handleCancel = () => {
    if (!isLoading) {
      onCancel?.();
      onOpenChange(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}

      {isMobile ? (
        <Drawer
          open={open}
          onOpenChange={onOpenChange}
          repositionInputs={false}
        >
          {triggerChildren && <DrawerTrigger>{triggerChildren}</DrawerTrigger>}

          <DrawerContent aria-describedby="">
            <div className="mx-auto flex w-full flex-col overflow-hidden">
              <DrawerHeader className="shrink-0 p-2">
                <div className="grid grid-cols-3 items-center gap-2">
                  <div className="justify-self-start">
                    <Button
                      variant="secondary"
                      onClick={handleCancel}
                      disabled={isLoading}
                    >
                      {cancelButtonLabel || t('Common.button.cancel')}
                    </Button>
                  </div>

                  <div className="justify-self-center text-center">
                    <DrawerTitle>{title}</DrawerTitle>
                  </div>

                  <div className="justify-self-end">
                    <ConfirmationDialog
                      title={t('Common.alertDialog.save.title')}
                      description={t('Common.alertDialog.save.description')}
                      ok={t('Common.alertDialog.save.okButton')}
                      handleSubmit={handleSubmitWithLoading}
                    >
                      <Button variant="ghost" disabled={isLoading}>
                        {okButtonLabel || t('Common.button.save')}
                      </Button>
                    </ConfirmationDialog>
                  </div>
                </div>
              </DrawerHeader>

              <div className="overflow-y-auto p-4">
                <div className="mx-auto w-full max-w-sm">{children}</div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Drawer
          open={open}
          onOpenChange={onOpenChange}
          repositionInputs={false}
        >
          <DrawerTrigger>{triggerChildren}</DrawerTrigger>

          <DrawerContent aria-describedby={description}>
            <div className="mx-auto w-full max-w-sm overflow-hidden">
              <DrawerHeader>
                <DrawerTitle>{title}</DrawerTitle>
                <DrawerDescription>{description}</DrawerDescription>
              </DrawerHeader>

              {/* <div className="flex-1 overflow-y-auto p-4">{children}</div> */}

              <div className="overflow-y-auto p-4">
                <div className="mx-auto w-full max-w-sm">{children}</div>
              </div>

              <DrawerFooter>
                <ConfirmationDialog
                  title={t('Common.alertDialog.save.title')}
                  description={t('Common.alertDialog.save.description')}
                  ok={t('Common.alertDialog.save.okButton')}
                  handleSubmit={handleSubmitWithLoading}
                >
                  <Button disabled={isLoading}>
                    {okButtonLabel || t('Common.button.save')}
                  </Button>
                </ConfirmationDialog>
                <DrawerClose>
                  <Button
                    variant="outline"
                    disabled={isLoading}
                    onClick={handleCancel}
                  >
                    {cancelButtonLabel || t('Common.button.cancel')}
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default CustomDrawer;

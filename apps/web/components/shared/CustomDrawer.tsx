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
import { Spinner } from '@web/components/ui/spinner';
import { useIsMobile } from '@web/hooks/use-mobile';
import { useTranslations } from 'next-intl';
import { Dispatch, ReactElement, SetStateAction, useState } from 'react';

import ConfirmationDialog from './ConfirmationDialog';
import Loader from './Loader';

type CustomDrawerProps = {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  title?: string;
  description?: string;
  okButtonLabel?: string;
  cancelButtonLabel?: string;
  children: ReactElement;
  triggerChildren?: ReactElement;
  handleSubmit: () => void | Promise<void>;
  onCancel?: () => void;
};

type RenderDrawerSaveButtonProps = {
  isLoading: boolean;
  label: string;
  mobile?: boolean;
};

const renderDrawerSaveButton = ({
  isLoading,
  label,
  mobile = false,
}: RenderDrawerSaveButtonProps) => (
  <Button
    className={mobile ? undefined : 'w-full'}
    variant={mobile ? 'ghost' : 'default'}
    disabled={isLoading}
    aria-busy={isLoading}
  >
    {isLoading && (
      <Spinner
        aria-hidden="true"
        role="presentation"
        className="motion-safe:animate-spin motion-reduce:animate-none"
      />
    )}
    <span>{label}</span>
  </Button>
);

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
  const saveButtonLabel = okButtonLabel || t('Common.button.save');

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

      <Drawer open={open} onOpenChange={onOpenChange}>
        {triggerChildren && (
          <DrawerTrigger
            render={triggerChildren}
            nativeButton={
              triggerChildren.type === 'button' ||
              triggerChildren.type === Button
            }
          />
        )}

        {isMobile ? (
          <DrawerContent aria-describedby="">
            <div className="mx-auto flex w-full flex-col overflow-hidden">
              <DrawerHeader className="shrink-0 p-2">
                <div className="grid grid-cols-3 items-center gap-2">
                  <div className="justify-self-start">
                    <Button
                      variant="ghost"
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
                      {renderDrawerSaveButton({
                        isLoading,
                        label: saveButtonLabel,
                        mobile: true,
                      })}
                    </ConfirmationDialog>
                  </div>
                </div>
              </DrawerHeader>

              <div className="overflow-y-auto p-4">
                <div className="mx-auto w-full max-w-sm">{children}</div>
              </div>
            </div>
          </DrawerContent>
        ) : (
          <DrawerContent aria-describedby={description}>
            <div className="mx-auto flex w-full max-w-sm flex-col overflow-hidden">
              <DrawerHeader className="shrink-0">
                <DrawerTitle>{title}</DrawerTitle>
                <DrawerDescription>{description}</DrawerDescription>
              </DrawerHeader>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="mx-auto w-full max-w-sm">{children}</div>
              </div>

              <DrawerFooter className="shrink-0">
                <ConfirmationDialog
                  title={t('Common.alertDialog.save.title')}
                  description={t('Common.alertDialog.save.description')}
                  ok={t('Common.alertDialog.save.okButton')}
                  handleSubmit={handleSubmitWithLoading}
                >
                  {renderDrawerSaveButton({
                    isLoading,
                    label: saveButtonLabel,
                  })}
                </ConfirmationDialog>
                <DrawerClose
                  render={
                    <Button
                      className="w-full"
                      variant="outline"
                      disabled={isLoading}
                      onClick={handleCancel}
                    >
                      {cancelButtonLabel || t('Common.button.cancel')}
                    </Button>
                  }
                />
              </DrawerFooter>
            </div>
          </DrawerContent>
        )}
      </Drawer>
    </>
  );
};

export default CustomDrawer;

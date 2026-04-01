import { Button, Drawer, Separator } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { ReactNode, useState } from 'react';

import ConfirmationDialog from './ConfirmationDialog';
import Loader from './Loader';

type CustomDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

      <Drawer>
        <Drawer.Trigger>{triggerChildren}</Drawer.Trigger>

        <Drawer.Backdrop isOpen={open} onOpenChange={onOpenChange}>
          <Drawer.Content aria-describedby={description}>
            <div className="mx-auto flex w-full max-w-sm flex-col overflow-hidden">
              <Drawer.Header>
                <Drawer.Heading>{title}</Drawer.Heading>
                <p>{description}</p>
              </Drawer.Header>

              <Separator />

              <div className="flex-1 overflow-y-auto p-4">{children}</div>
            </div>

            <Drawer.Footer className="mx-auto w-full max-w-sm">
              <ConfirmationDialog
                title={t('Common.alertDialog.save.title')}
                description={t('Common.alertDialog.save.description')}
                ok={t('Common.alertDialog.save.okButton')}
                handleSubmit={handleSubmitWithLoading}
              >
                <Button isDisabled={isLoading}>
                  {okButtonLabel || t('Common.button.save')}
                </Button>
              </ConfirmationDialog>

              <Button
                variant="outline"
                isDisabled={isLoading}
                onClick={handleCancel}
              >
                {cancelButtonLabel || t('Common.button.cancel')}
              </Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
    </>
  );
};

export default CustomDrawer;

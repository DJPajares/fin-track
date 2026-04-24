'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@web/components/ui/alert-dialog';
import { Button } from '@web/components/ui/button';
import { useTranslations } from 'next-intl';
import { ReactElement, useState } from 'react';

type ConfirmationDialogProps = {
  title?: string;
  description?: string;
  ok?: string;
  cancel?: string;
  handleSubmit: () => void | Promise<void>;
  isDestructive?: boolean;
  children: ReactElement;
};

const ConfirmationDialog = ({
  title,
  description,
  ok,
  cancel,
  handleSubmit,
  isDestructive = false,
  children,
}: ConfirmationDialogProps) => {
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  const handleActionClick = async () => {
    try {
      await handleSubmit();
    } finally {
      setOpen(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={children}
        nativeButton={children.type === 'button' || children.type === Button}
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title || t('Common.alertDialog.generic.title')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {description || t('Common.alertDialog.generic.description')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {cancel || t('Common.alertDialog.generic.cancelButton')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleActionClick}
            className={isDestructive ? 'bg-destructive' : ''}
          >
            {ok || t('Common.alertDialog.generic.okButton')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationDialog;

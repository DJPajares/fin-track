'use client';

import { ReactNode, useState } from 'react';
import { useTranslations } from 'next-intl';
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
} from '../ui/alert-dialog';
import Loader from './Loader';

type ConfirmationDialogProps = {
  handleSubmit: () => void | Promise<void>;
  children: ReactNode;
};

const ConfirmationDialog = ({
  handleSubmit,
  children,
}: ConfirmationDialogProps) => {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);

  const onConfirm = async () => {
    setIsLoading(true);

    try {
      await handleSubmit();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('Common.alertDialog.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('Common.alertDialog.description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>
              {t('Common.alertDialog.cancelButton')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm} disabled={isLoading}>
              {t('Common.alertDialog.okButton')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isLoading && <Loader />}
    </>
  );
};

export default ConfirmationDialog;

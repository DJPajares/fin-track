'use client';

import { ReactNode } from 'react';
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

type ConfirmationDialogProps = {
  title?: string;
  description?: string;
  ok?: string;
  cancel?: string;
  handleSubmit: () => void | Promise<void>;
  isDestructive?: boolean;
  children: ReactNode;
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

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
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
            onClick={handleSubmit}
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

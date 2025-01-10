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
  AlertDialogTrigger
} from '../ui/alert-dialog';

type ConfirmationDialogProps = {
  handleSubmit: () => void;
  children: ReactNode;
};

const ConfirmationDialog = ({
  handleSubmit,
  children
}: ConfirmationDialogProps) => {
  const t = useTranslations();

  return (
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
          <AlertDialogCancel>
            {t('Common.alertDialog.cancelButton')}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>
            {t('Common.alertDialog.okButton')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationDialog;

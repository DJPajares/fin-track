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
import { Spinner } from '@web/components/ui/spinner';
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
  const [isLoading, setIsLoading] = useState(false);

  const handleActionClick = async () => {
    setIsLoading(true);
    try {
      await handleSubmit();
    } finally {
      setIsLoading(false);
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
          <AlertDialogCancel disabled={isLoading}>
            {cancel || t('Common.alertDialog.generic.cancelButton')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleActionClick}
            disabled={isLoading}
            aria-busy={isLoading}
            className={isDestructive ? 'bg-destructive' : ''}
          >
            {isLoading && (
              <Spinner
                aria-hidden="true"
                role="presentation"
                className="motion-safe:animate-spin motion-reduce:animate-none"
              />
            )}
            <span>{ok || t('Common.alertDialog.generic.okButton')}</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationDialog;

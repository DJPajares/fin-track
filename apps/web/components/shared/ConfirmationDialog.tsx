'use client';

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseTrigger,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogHeading,
  AlertDialogTrigger,
} from '@heroui/react';
import { cn } from '@web/lib/utils';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';

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
      <AlertDialogTrigger>{children as React.ReactElement}</AlertDialogTrigger>
      <AlertDialogBody className="gap-4 p-6">
        <AlertDialogHeader>
          <AlertDialogHeading className="text-lg font-semibold">
            {title || t('Common.alertDialog.generic.title')}
          </AlertDialogHeading>
          <p className="text-muted-foreground text-sm">
            {description || t('Common.alertDialog.generic.description')}
          </p>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <AlertDialogCloseTrigger>
            {cancel || t('Common.alertDialog.generic.cancelButton')}
          </AlertDialogCloseTrigger>
          <AlertDialogCloseTrigger
            onClick={handleSubmit}
            className={cn(isDestructive ? 'bg-destructive' : '')}
          >
            {ok || t('Common.alertDialog.generic.okButton')}
          </AlertDialogCloseTrigger>
        </AlertDialogFooter>
      </AlertDialogBody>
    </AlertDialog>
  );
};

export default ConfirmationDialog;

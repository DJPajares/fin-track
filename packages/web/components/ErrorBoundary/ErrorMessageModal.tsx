'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@web/components/ui/dialog';
import { Button } from '@web/components/ui/button';
import { Label } from '@web/components/ui/label';

import type { ErrorProps } from '@shared/types/Error';

type ErrorMessageModalProps = {
  isOpen: boolean;
  error: ErrorProps;
  onClose?: () => void;
};

const ErrorMessageModal = ({
  isOpen,
  error,
  onClose,
}: ErrorMessageModalProps) => {
  const t = useTranslations();

  const errorMessage = useMemo(() => error.message, [error]);

  const handleOk = () => {
    onClose?.();
  };

  const handleClose = () => {
    onClose?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="[&>button]:hidden"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>{t('Common.title.errorModal')}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div>
          <Label className="text-destructive">{errorMessage}</Label>
        </div>

        <DialogFooter>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button onClick={handleOk}>{t('Common.button.ok')}</Button>
            </DialogClose>
          </DialogFooter>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ErrorMessageModal;

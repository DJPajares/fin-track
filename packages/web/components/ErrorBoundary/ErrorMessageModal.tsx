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

// User-friendly error mapping using translations and error codes/keys
const getUserFriendlyError = (
  error: ErrorProps | undefined,
  t: (key: string) => string,
): string => {
  if (!error) return t('Common.error.generic');
  if (error.code) {
    switch (error.code) {
      case 'DUPLICATE_CATEGORY':
        return t('Common.error.duplicateCategory');
      case 'VALIDATION_ERROR':
        return t('Common.error.validation');
      case 'CATEGORY_ID_EXISTS_GLOBAL':
        return t('Common.error.duplicateCategory');
      default:
        break;
    }
  }
  if (error.userMessageKey) return t(error.userMessageKey);
  return error.message || t('Common.error.generic');
};

const ErrorMessageModal = ({
  isOpen,
  error,
  onClose,
}: ErrorMessageModalProps) => {
  const t = useTranslations();

  const errorMessage = useMemo(
    () => getUserFriendlyError(error, t),
    [error, t],
  );

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

'use client';

import {
  Button,
  Modal,
  ModalBody,
  ModalCloseTrigger,
  ModalFooter,
  ModalHeader,
  ModalHeading,
} from '@heroui/react';
import type { ErrorProps } from '@shared/types/Error';
import { Label } from '@web/components/shared/Typography';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

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
    <Modal isOpen={isOpen} onOpenChange={handleClose}>
      <ModalBody className="gap-4 p-6">
        <ModalHeader>
          <ModalHeading>{t('Common.title.errorModal')}</ModalHeading>
        </ModalHeader>

        <div>
          <Label className="text-destructive">{errorMessage}</Label>
        </div>

        <ModalFooter>
          <ModalCloseTrigger>
            <Button onClick={handleOk}>{t('Common.button.ok')}</Button>
          </ModalCloseTrigger>
        </ModalFooter>
      </ModalBody>
    </Modal>
  );
};

export default ErrorMessageModal;

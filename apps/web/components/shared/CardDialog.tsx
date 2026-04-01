import {
  Card,
  Modal,
  ModalBody,
  ModalHeader,
  ModalHeading,
  ModalTrigger,
} from '@heroui/react';
import { Label } from '@web/components/shared/Typography';
import { ReactNode } from 'react';

import { cn } from '../../lib/utils';

type CardDialogProps = {
  title?: string;
  description?: string;
  isExpandable?: boolean;
  children: ReactNode;
  className?: string;
};

const Content = ({ title, isExpandable, children }: CardDialogProps) =>
  isExpandable ? (
    <Modal>
      <ModalTrigger>
        <div className={`${title && 'my-2'}`}>{children}</div>
      </ModalTrigger>

      <ModalBody className="max-w-xs justify-center gap-4 p-6">
        <ModalHeader>
          <ModalHeading className="font-extralight tracking-wider">
            {title}
          </ModalHeading>
        </ModalHeader>

        {children}
      </ModalBody>
    </Modal>
  ) : (
    <div className={`${title && 'my-2'}`}>{children}</div>
  );

const CardDialog = ({
  title,
  description,
  isExpandable = false,
  children,
  className,
}: CardDialogProps) => {
  return (
    <Card className={cn(`${isExpandable && 'cursor-pointer'}`, className)}>
      {title ? (
        <>
          <Card.Header className="px-4">
            <Card.Description>{title}</Card.Description>
            {description && (
              <Card.Description>
                <Label variant="caption">{description}</Label>
              </Card.Description>
            )}
          </Card.Header>

          <Card.Content className="px-4">
            <Content isExpandable={isExpandable} title={title}>
              {children}
            </Content>
          </Card.Content>
        </>
      ) : (
        <Card.Content className="px-4">
          <Content isExpandable={isExpandable} title={title}>
            {children}
          </Content>
        </Card.Content>
      )}
    </Card>
  );
};

export default CardDialog;

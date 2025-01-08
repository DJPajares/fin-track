import {
  Children,
  cloneElement,
  Dispatch,
  isValidElement,
  ReactElement,
  ReactNode,
  SetStateAction,
  useRef,
  useState
} from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '../ui/drawer';
import { Button } from '../ui/button';
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
import { useIsMobile } from '@web/lib/hooks/use-mobile';
import { useTranslations } from 'next-intl';
import { on } from 'events';

type CustomDrawerProps = {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  title?: string;
  description?: string;
  footerOk?: string;
  footerCancel?: string;
  children: ReactNode;
  triggerChildren: ReactNode;
  handleSubmit: () => void;
};

const CustomDrawer = ({
  open,
  onOpenChange,
  title,
  description,
  footerOk = 'Ok',
  footerCancel = 'Cancel',
  children,
  triggerChildren,
  handleSubmit
}: CustomDrawerProps) => {
  const isMobile = useIsMobile();
  const t = useTranslations();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // const formRef = useRef<HTMLFormElement>(null);

  const handleSubmitButton = () => {
    // if (formRef.current) formRef.current.requestSubmit();

    handleSubmit();
    onOpenChange(false);
  };

  return (
    <>
      {isMobile ? (
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerTrigger asChild>{triggerChildren}</DrawerTrigger>

          <DrawerContent className="h-[97%]" aria-describedby={description}>
            <div className="mx-auto w-full max-w-sm">
              <div className="flex flex-row items-center justify-between py-2">
                <Button variant="ghost" onClick={() => onOpenChange(!open)}>
                  {footerCancel}
                </Button>
                <DrawerTitle>{title}</DrawerTitle>
                <Button variant="ghost" onClick={handleSubmit}>
                  {t('Common.alertDialog.triggerButton')}
                </Button>
              </div>

              <div className="py-4 px-4 space-y-2 overflow-auto">
                {children}
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerTrigger asChild>{triggerChildren}</DrawerTrigger>

          <DrawerContent aria-describedby={description}>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>{title}</DrawerTitle>
                <DrawerDescription>{description}</DrawerDescription>
              </DrawerHeader>

              <div className="py-4 px-4 space-y-2 overflow-auto">
                {children}
              </div>
            </div>

            <DrawerFooter className="mx-auto w-full max-w-sm">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button>{t('Common.alertDialog.triggerButton')}</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {t('Common.alertDialog.title')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('Common.alertDialog.description')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>
                      {t('Common.button.cancel')}
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleSubmitButton}>
                      {t('Common.alertDialog.okButton')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <DrawerClose asChild>
                <Button variant="outline">{t('Common.button.cancel')}</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default CustomDrawer;

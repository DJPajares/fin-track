import { Dispatch, ReactNode, SetStateAction, useRef, useState } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '../ui/drawer';
import { Button } from '../ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '../ui/alert-dialog';

type CustomDrawerProps = {
  isDrawerOpen: boolean;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
  title?: string;
  footerOk?: string;
  footerCancel?: string;
  children: ReactNode;
};

const CustomDrawer = ({
  isDrawerOpen,
  setIsDrawerOpen,
  title,
  footerOk = 'Ok',
  footerCancel = 'Cancel',
  children
}: CustomDrawerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formRef = useRef<HTMLFormElement>();

  const handleAddButton = async () => {
    // Request submit to the child component
    if (formRef.current) formRef.current.requestSubmit();
  };

  return (
    <>
      <Drawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        shouldScaleBackground
      >
        <DrawerContent>
          <div className="mx-auto w-full max-w-lg overflow-y-scroll max-h-screen">
            {title && (
              <DrawerHeader>
                <DrawerTitle>{title.toUpperCase()}</DrawerTitle>
              </DrawerHeader>
            )}

            {children}

            <DrawerFooter className="my-2">
              <Button onClick={() => setIsDialogOpen(true)}>{footerOk}</Button>
              <DrawerClose asChild>
                <Button variant="outline">{footerCancel}</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAddButton}>Ok</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CustomDrawer;

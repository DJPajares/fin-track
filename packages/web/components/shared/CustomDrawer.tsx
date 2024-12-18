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
  DrawerTitle
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
  AlertDialogTitle
} from '../ui/alert-dialog';

type CustomDrawerProps = {
  isDrawerOpen: boolean;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
  title?: string;
  description?: string;
  footerOk?: string;
  footerCancel?: string;
  children: ReactNode;
  handleSubmit: any;
};

const CustomDrawer = ({
  isDrawerOpen,
  setIsDrawerOpen,
  title,
  description,
  footerOk = 'Ok',
  footerCancel = 'Cancel',
  children,
  handleSubmit
}: CustomDrawerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // const formRef = useRef<HTMLFormElement>(null);

  const handleSubmitButton = () => {
    // if (formRef.current) formRef.current.requestSubmit();

    handleSubmit();
    setIsDrawerOpen(false);
  };

  // const handleSubmit = async () => {
  //   // Request submit to the child component
  //   if (formRef.current) formRef.current.requestSubmit();

  //   // // Call the handleSubmit function attached in the formRef
  //   // if (formRef.current) formRef.current();
  // };

  // Function to clone the children and pass formRef as prop
  // const renderChildrenWithProps = () => {
  //   return Children.map(children, (child) => {
  //     if (isValidElement(child)) {
  //       return cloneElement(child, { formRef });
  //     }
  //     return child;
  //   });
  // };

  return (
    <>
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-lg overflow-y-auto max-h-screen">
            <DrawerHeader>
              {title && <DrawerTitle>{title.toUpperCase()}</DrawerTitle>}
              {description && (
                <DrawerDescription>{description}</DrawerDescription>
              )}
            </DrawerHeader>

            {children}
            {/* {cloneElement(children as ReactElement<any>, {
              formRef
            })} */}

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
            <AlertDialogDescription>
              This cannot be undone
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmitButton}>
              Ok
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CustomDrawer;

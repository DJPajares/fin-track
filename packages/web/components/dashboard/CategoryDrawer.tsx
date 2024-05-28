import { Dispatch, SetStateAction, useState } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Progress } from '@nextui-org/progress';
import { formatCurrency } from '../../../../shared/utilities/formatCurrency';
import type {
  TransactionPaymentCategoryProps,
  TransactionProps
} from '../../../../shared/types/transactionPaymentTypes';
import { CheckIcon } from 'lucide-react';

type CategoryDrawerProps = {
  category: TransactionPaymentCategoryProps;
  currency: string;
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
};

// const Content = ({
//   category,
//   currency,
//   openPaymentDialog
// }: CategoryDrawerContentProps) => (
//   <div className="flex flex-col justify-between p-4">
//     {Object.keys(category).length > 0 &&
//       category.transactions.map((transaction: any) => (
//         <div
//           key={transaction._id}
//           className="grid grid-cols-6 gap-2 items-center py-1"
//         >
//           <div className="col-span-2">
//             <p className="text-sm sm:text-base sm:font-medium truncate hover:text-clip">
//               {transaction.name}
//             </p>
//           </div>
//           <div className="col-span-3 flex flex-col px-2">
//             <div className="flex flex-row items-center justify-between pb-1">
//               <p className="text-sm">
//                 {formatCurrency({
//                   value: transaction.amount,
//                   currency
//                 })}
//               </p>
//               <p className="text-xs">
//                 {Math.floor(
//                   (transaction.paidAmount / transaction.amount) * 100
//                 )}
//                 %
//               </p>
//             </div>
//             <Progress
//               color="success"
//               aria-label="Loading..."
//               value={(transaction.paidAmount / transaction.amount) * 100}
//               size="sm"
//             />
//           </div>
//           <div className="flex flex-row justify-end">
//             {/* <Button variant="outline" size="icon">
//               <HandCoinsIcon className="h-4 w-4" />
//             </Button> */}
//             <Button
//               variant="outline"
//               size="icon"
//               onClick={() => openPaymentDialog({ transaction })}
//             >
//               <CheckIcon className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>
//       ))}
//   </div>
// );

const CategoryDrawer = ({
  category,
  currency,
  isDialogOpen,
  setIsDialogOpen
}: CategoryDrawerProps) => {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [transactionData, setTransactionData] = useState<TransactionProps>({});

  const openPaymentDialog = (transaction: TransactionProps) => {
    // console.log(transaction);
    setTransactionData(transaction);
    // setIsPaymentDialogOpen(true);
  };

  const updateTransactionData = () => {
    console.log('updated transaction');
  };

  return (
    <div>
      <Drawer
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        shouldScaleBackground
      >
        <DrawerContent>
          <div className="mx-auto w-full max-w-lg">
            <DrawerHeader>
              <DrawerTitle>{category.name}</DrawerTitle>
            </DrawerHeader>

            <div className="flex flex-col justify-between p-4">
              {Object.keys(category).length > 0 &&
                category.transactions.map((transaction: any) => (
                  <div
                    key={transaction._id}
                    className="grid grid-cols-6 gap-2 items-center py-1"
                  >
                    <div className="col-span-2">
                      <p className="text-sm sm:text-base sm:font-medium truncate hover:text-clip">
                        {transaction.name}
                      </p>
                    </div>
                    <div className="col-span-3">
                      <Progress
                        color="success"
                        label={formatCurrency({
                          value: transaction.amount,
                          currency
                        })}
                        value={Math.floor(
                          (transaction.paidAmount / transaction.amount) * 100
                        )}
                        size="sm"
                        radius="sm"
                        showValueLabel={true}
                      />
                    </div>
                    <div className="flex flex-row justify-end">
                      {/* <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openPaymentDialog(transaction)}
                      >
                        <CheckIcon className="h-4 w-4" />
                      </Button> */}

                      <Popover onOpenChange={updateTransactionData}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openPaymentDialog(transaction)}
                          >
                            <CheckIcon className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <div className="pb-2">
                            <p className="sm:text-lg font-semibold sm:font-bold">
                              {transactionData.name}
                            </p>
                          </div>
                          <div className="flex flex-row items-end justify-between">
                            <Input
                              className="w-30"
                              defaultValue={transaction.amount}
                            ></Input>
                            <p className="text-sm font-medium">{`/ ${formatCurrency(
                              {
                                value: transaction.amount,
                                currency
                              }
                            )}`}</p>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                ))}
            </div>

            <DrawerFooter>
              <Button>Confirm</Button>
              <DrawerClose asChild>
                <Button variant="outline" onClick={() => setIsDialogOpen}>
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Payment Dialog */}
      {/* <Popover
        open={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
        // modal={true}
      >
        <PopoverContent>
          <p>{transactionData.name}</p>

          <div></div>
        </PopoverContent>
      </Popover> */}
    </div>
  );
};

export default CategoryDrawer;

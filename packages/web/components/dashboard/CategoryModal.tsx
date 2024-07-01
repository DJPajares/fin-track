import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@nextui-org/react';
import { CheckIcon, HandCoinsIcon } from 'lucide-react';
import { formatCurrency } from '../../../../shared/utilities/formatCurrency';
import type { TransactionPaymentCategoryProps } from '../../types/transactionPaymentTypes';

type CategoryModalProps = {
  category: TransactionPaymentCategoryProps;
  currency: string;
  isDialogOpen: boolean;
  handleCloseDialog: () => void;
};

const CategoryModal = ({
  category,
  currency,
  isDialogOpen,
  handleCloseDialog
}: CategoryModalProps) => (
  <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{category.name}</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col">
        {Object.keys(category).length > 0 &&
          category.transactions.map((transaction: any) => (
            <div
              key={transaction._id}
              className="grid grid-cols-9 gap-2 items-center py-1"
            >
              <div className="col-span-2">{transaction.name}</div>
              <div className="col-span-2 text-right">
                <p className="text-sm">
                  {formatCurrency({
                    value: transaction.amount,
                    currency
                  })}
                </p>
              </div>
              <div className="col-span-2">
                <Progress
                  color="success"
                  aria-label="Loading..."
                  value={(transaction.paidAmount / transaction.amount) * 100}
                  size="sm"
                />
              </div>
              <div className="text-left">
                <p className="text-xs">
                  {Math.floor(
                    (transaction.paidAmount / transaction.amount) * 100
                  )}
                  %
                </p>
              </div>
              <div className="flex flex-row justify-end col-span-2">
                <Button variant="outline" size="icon">
                  <HandCoinsIcon className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <CheckIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
      </div>
      <DialogFooter>
        <DialogClose>
          <Button>OK</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default CategoryModal;

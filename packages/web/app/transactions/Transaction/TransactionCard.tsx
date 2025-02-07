import { Chip } from '@heroui/react';
import { Card } from '../../../components/ui/card';
import EditTransactionDrawer from '../EditTransaction/EditTransactionDrawer';

import CardIcon from '../../../components/shared/CardIcon';
import { formatCurrency } from '@shared/utilities/formatCurrency';

import type { TransactionProps } from '../../../types/Transaction';
import { useState } from 'react';

type TransactionCardProps = {
  date: Date;
  transaction: TransactionProps;
};

const TransactionCard = ({ transaction, date }: TransactionCardProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div key={transaction._id} className="space-y-2">
      <EditTransactionDrawer
        date={date}
        transaction={transaction}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
      >
        <Card className="bg-accent/70 cursor-pointer p-2">
          <div className="flex items-center gap-3">
            <CardIcon
              icon={transaction.categoryIcon}
              className="text-muted-foreground h-8 w-8"
            />

            <div className="flex-1">
              <div className="flex flex-row items-center justify-between">
                <p className="text-sm font-semibold">{transaction.name}</p>

                <p className="text-sm font-semibold">
                  {formatCurrency({
                    value: transaction.amount,
                    currency: transaction.currencyName,
                    decimal: 2,
                  })}
                </p>
              </div>

              <div className="flex flex-row items-center justify-between">
                <p className="text-muted-foreground truncate text-xs hover:text-clip sm:text-base">
                  {transaction.categoryName}
                </p>

                <Chip
                  variant="flat"
                  size="sm"
                  radius="lg"
                  classNames={{ content: 'font-semibold' }}
                >
                  {transaction.currencyName}
                </Chip>
              </div>
            </div>
          </div>
        </Card>
      </EditTransactionDrawer>
    </div>
  );
};

export default TransactionCard;

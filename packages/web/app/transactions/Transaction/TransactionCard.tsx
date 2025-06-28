import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Chip } from '@heroui/react';
import { Card, CardContent } from '../../../components/ui/card';
import { Label } from '@web/components/ui/label';
import CardIcon from '../../../components/shared/CardIcon';
import EditTransactionDrawer from '../EditTransaction/EditTransactionDrawer';

import { formatCurrency } from '@shared/utilities/formatCurrency';

import type { TransactionProps } from '../../../types/Transaction';

type TransactionCardProps = {
  date: Date;
  transaction: TransactionProps;
};

const TransactionCard = ({ date, transaction }: TransactionCardProps) => {
  const t = useTranslations();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isTranslated = t.has(
    `Common.category.${transaction.categoryIdSerialized}`,
  );

  return (
    <div key={transaction._id} className="space-y-2">
      <EditTransactionDrawer
        date={date}
        transaction={transaction}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
      >
        <Card className="cursor-pointer">
          <CardContent className="flex items-center gap-4">
            <CardIcon
              icon={transaction.categoryIcon}
              className="text-muted-foreground size-8 flex-shrink-0"
            />

            <div className="min-w-0 flex-1">
              <div className="flex flex-row items-center justify-between gap-2">
                <Label className="min-w-0 flex-1 truncate text-sm font-semibold">
                  {transaction.name}
                </Label>

                <Label className="flex-shrink-0 text-sm font-semibold">
                  {formatCurrency({
                    value: transaction.amount,
                    currency: transaction.currencyName,
                    decimal: 2,
                  })}
                </Label>
              </div>

              <div className="flex flex-row items-center justify-between">
                <Label className="text-muted-foreground truncate text-xs hover:text-clip sm:text-base">
                  {isTranslated
                    ? t(`Common.category.${transaction.categoryIdSerialized}`)
                    : transaction.categoryName}
                </Label>

                <Chip
                  variant="flat"
                  size="sm"
                  radius="lg"
                  classNames={{ content: 'font-bold' }}
                >
                  {transaction.currencyName}
                </Chip>
              </div>
            </div>
          </CardContent>
        </Card>
      </EditTransactionDrawer>
    </div>
  );
};

export default TransactionCard;

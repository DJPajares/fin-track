import { formatCurrency } from '@shared/utilities/formatCurrency';
import EditTransactionDrawer from '@web/app/transactions/EditTransaction/EditTransactionDrawer';
import CardIcon from '@web/components/shared/CardIcon';
import {
  TypographyLabel,
  TypographyMuted,
} from '@web/components/shared/Typography';
import { Badge } from '@web/components/ui/badge';
import { Card, CardContent } from '@web/components/ui/card';
import type { TransactionProps } from '@web/types/Transaction';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

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
        <Card className="w-full cursor-pointer">
          <CardContent className="flex items-center gap-4">
            <CardIcon
              icon={transaction.categoryIcon}
              className="text-muted-foreground size-8 shrink-0"
            />

            <div className="min-w-0 flex-1">
              <div className="flex flex-row items-center justify-between gap-2">
                <TypographyLabel className="min-w-0 flex-1 truncate">
                  {transaction.name}
                </TypographyLabel>

                <TypographyLabel>
                  {formatCurrency({
                    value: transaction.amount,
                    currency: transaction.currencyName,
                    decimal: 2,
                  })}
                </TypographyLabel>
              </div>

              <div className="flex flex-row items-center justify-between">
                <TypographyMuted className="truncate hover:text-clip">
                  {isTranslated
                    ? t(`Common.category.${transaction.categoryIdSerialized}`)
                    : transaction.categoryName}
                </TypographyMuted>

                <Badge variant="outline">{transaction.currencyName}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </EditTransactionDrawer>
    </div>
  );
};

export default TransactionCard;

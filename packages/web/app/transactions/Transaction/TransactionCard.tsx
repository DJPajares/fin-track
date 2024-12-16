import { Chip } from '@nextui-org/react';
import { Card } from '../../../components/ui/card';
import EditTransactionDrawer from '../EditTransaction/EditTransactionDrawer';

import CardIcon from '../../../components/shared/CardIcon';
import { formatCurrency } from '@shared/utilities/formatCurrency';

import type { IconProps } from '../../../components/shared/CardIcon';

type TransactionProps = {
  _id: string;
  name: string;
  typeId: string;
  typeName: string;
  categoryId: string;
  categoryName: string;
  categoryIcon: IconProps;
  currencyId: string;
  currencyName: string;
  amount: number;
  description: string;
};

type TransactionCardProps = {
  transaction: TransactionProps;
  // fetchTransactionsData?: () => void;
};

// const TransactionCard = ({
//   transactions,
//   fetchTransactionsData,
//   loading
// }: TransactionCardProps) => {
//   return (
//     <>
//       {transactions.length > 1 &&
//         transactions.map((transaction) => (
//           <div key={transaction._id} className="space-y-2">
//             <EditTransactionDrawer
//               transaction={transaction}
//               fetchTransactions={fetchTransactionsData}
//             >
//               <Card className="bg-accent/70 cursor-pointer p-2">
//                 <div className="flex items-center gap-3">
//                   <CardIcon
//                     icon={transaction.categoryIcon}
//                     className="text-muted-foreground w-8 h-8"
//                   />

//                   <div className="flex-1">
//                     <div className="flex flex-row items-center justify-between">
//                       <p className="text-sm font-semibold">
//                         {transaction.name}
//                       </p>

//                       <p className="text-sm font-semibold">
//                         {formatCurrency({
//                           value: transaction.amount,
//                           currency: transaction.currencyName,
//                           decimal: 2
//                         })}
//                       </p>
//                     </div>

//                     <div className="flex flex-row items-center justify-between">
//                       <p className="text-xs sm:text-base text-muted-foreground truncate hover:text-clip">
//                         {transaction.categoryName}
//                       </p>

//                       <Chip
//                         variant="flat"
//                         size="sm"
//                         radius="lg"
//                         classNames={{ content: 'font-semibold' }}
//                       >
//                         {transaction.currencyName}
//                       </Chip>
//                     </div>
//                   </div>
//                 </div>
//               </Card>
//             </EditTransactionDrawer>
//           </div>
//         ))}

//       {loading && (
//         <div className="flex flex-row items-center justify-center">
//           <Label>Loading....</Label>
//         </div>
//       )}
//     </>
//   );
// };

const TransactionCard = ({
  transaction
}: // fetchTransactionsData
TransactionCardProps) => {
  return (
    <div key={transaction._id} className="space-y-2">
      <EditTransactionDrawer
        transaction={transaction}
        // fetchTransactions={fetchTransactionsData}
      >
        <Card className="bg-accent/70 cursor-pointer p-2">
          <div className="flex items-center gap-3">
            <CardIcon
              icon={transaction.categoryIcon}
              className="text-muted-foreground w-8 h-8"
            />

            <div className="flex-1">
              <div className="flex flex-row items-center justify-between">
                <p className="text-sm font-semibold">{transaction.name}</p>

                <p className="text-sm font-semibold">
                  {formatCurrency({
                    value: transaction.amount,
                    currency: transaction.currencyName,
                    decimal: 2
                  })}
                </p>
              </div>

              <div className="flex flex-row items-center justify-between">
                <p className="text-xs sm:text-base text-muted-foreground truncate hover:text-clip">
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

import { formatCurrencyToParts } from '@shared/utilities/formatCurrency';
import CardIcon from '@web/components/shared/CardIcon';
import {
  TypographyLabel,
  TypographyMuted,
} from '@web/components/shared/Typography';
import { Card } from '@web/components/ui/card';
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from '@web/components/ui/progress';
import type { TransactionPaymentCategoryProps } from '@web/types/TransactionPayment';
import { useTranslations } from 'next-intl';

type CategoryCardProps = {
  category: TransactionPaymentCategoryProps;
  currency: string;
  handleCardClick: (category: TransactionPaymentCategoryProps) => void;
};

const CategoryCard = ({
  category,
  currency,
  handleCardClick,
}: CategoryCardProps) => {
  const t = useTranslations();

  const { id, icon } = category;

  const isTranslated = t.has(`Common.category.${id}`);

  const progressPercentage = Math.floor(
    (category.totalPaidAmount / category.totalAmount) * 100,
  );

  return (
    <Card
      onClick={() => handleCardClick(category)}
      className="flex h-44 cursor-pointer flex-col justify-between gap-2 p-5 sm:h-56 sm:p-8"
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-row items-center justify-between">
          <TypographyMuted className="truncate tracking-wide hover:text-clip">
            {isTranslated ? t(`Common.category.${id}`) : category.name}
          </TypographyMuted>

          {
            <CardIcon
              icon={icon}
              className="text-muted-foreground size-5 sm:h-6 sm:w-6"
            />
          }
        </div>

        <TypographyLabel>
          {formatCurrencyToParts({
            value: category.totalAmount,
            currency,
          }).map((part, idx) => (
            <span
              key={idx}
              className={part.type === 'currency' ? 'text-primary' : undefined}
            >
              {part.value}
            </span>
          ))}
        </TypographyLabel>
      </div>

      <Progress value={progressPercentage}>
        <ProgressLabel>{t('Page.dashboard.card.settled')}</ProgressLabel>
        <ProgressValue />
      </Progress>
    </Card>
  );
};

export default CategoryCard;

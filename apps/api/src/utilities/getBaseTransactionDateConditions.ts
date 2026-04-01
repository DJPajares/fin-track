const getYearMonthExpression = (field: string) => ({
  $add: [{ $multiply: [{ $year: `$${field}` }, 100] }, { $month: `$${field}` }],
});

const getBaseTransactionDateConditions = (yearMonth: number) => {
  return [
    {
      $lte: [getYearMonthExpression('startDate'), yearMonth],
    },
    {
      $gte: [getYearMonthExpression('endDate'), yearMonth],
    },
    {
      $not: {
        $in: [
          yearMonth,
          {
            $map: {
              input: '$excludedDates',
              as: 'date',
              in: {
                $add: [
                  { $multiply: [{ $year: '$$date' }, 100] },
                  { $month: '$$date' },
                ],
              },
            },
          },
        ],
      },
    },
  ];
};

export { getBaseTransactionDateConditions, getYearMonthExpression };

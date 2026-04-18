import { TypographyLabel } from '@web/components/shared/Typography';
import { type ChartConfig, ChartContainer } from '@web/components/ui/chart';
import { cn } from '@web/lib/utils';
import type { ComponentProps } from 'react';
import {
  Label,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from 'recharts';

type CircularProgressClassNames = {
  svg?: string;
  value?: string;
  indicator?: string;
  label?: string;
};

type CircularProgressProps = {
  value: number;
  label?: string;
  showValueLabel?: boolean;
  strokeWidth?: number;
  classNames?: CircularProgressClassNames;
} & Omit<ComponentProps<'div'>, 'children'>;

const chartConfig = {
  value: {
    color: 'var(--primary)',
  },
} satisfies ChartConfig;

const getIndicatorColor = (indicatorClassName?: string) => {
  if (!indicatorClassName) return 'var(--primary)';

  if (indicatorClassName.includes('color-success')) {
    return 'var(--color-green-500)';
  }

  if (indicatorClassName.includes('color-warning')) {
    return 'var(--color-yellow-500)';
  }

  if (indicatorClassName.includes('color-destructive')) {
    return 'var(--destructive)';
  }

  if (indicatorClassName.includes('color-primary')) {
    return 'var(--primary)';
  }

  if (indicatorClassName.includes('color-secondary')) {
    return 'var(--secondary)';
  }

  return 'var(--primary)';
};

export const CircularProgress = ({
  value,
  label,
  showValueLabel = false,
  strokeWidth = 3,
  classNames,
  className,
  ...props
}: CircularProgressProps) => {
  const progressValue = Math.max(0, Math.min(100, Math.round(value ?? 0)));
  const indicatorColor = getIndicatorColor(classNames?.indicator);

  const progressData = [
    {
      value: progressValue,
    },
  ];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2',
        className,
      )}
      {...props}
    >
      <ChartContainer
        config={chartConfig}
        className={cn(
          'mx-auto aspect-square h-32 w-32 overflow-visible sm:h-64 sm:w-64',
          classNames?.svg,
        )}
      >
        <RadialBarChart
          data={progressData}
          startAngle={90}
          endAngle={-270}
          innerRadius="72%"
          outerRadius="100%"
          barSize={Math.max(strokeWidth * 4, 8)}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar
            dataKey="value"
            fill={indicatorColor}
            background={{ fill: 'var(--muted)' }}
            cornerRadius={999}
          />

          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className={cn(
                          'fill-foreground text-xl font-bold sm:text-4xl',
                          classNames?.value,
                        )}
                      >
                        {`${progressValue}%`}
                      </tspan>
                    </text>
                  );
                }

                return null;
              }}
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </ChartContainer>

      {showValueLabel && label && (
        <TypographyLabel className={classNames?.label}>{label}</TypographyLabel>
      )}
    </div>
  );
};

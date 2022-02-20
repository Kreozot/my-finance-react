import { memo, VFC } from 'react';
import {
  Chart, Lines, Ticks, Labels,
} from 'rumble-charts';

import { dates } from 'store';
import { formatMoney } from 'money';
import { FixedCellProps, FixedRow } from '../data-table';
import { isNonAbsoluteRow } from '../tableUtils';

import styles from './ChartCell.module.scss';

const formatLabel = (text: string) => {
  return formatMoney(Number(text));
};

const yearTicks = dates.reduce((result, dateKey: string, index: number) => {
  const month = dateKey.slice(5, 7);
  if (month === '01') {
    result.push(index);
  }
  return result;
}, [] as number[]);

const getValue = (row: FixedRow, dateKey: string) => {
  const value: number = row.original
    ? row.original.transactions[dateKey] || 0
    : row.values[dateKey] || 0;
  return isNonAbsoluteRow(row)
    ? value
    : Math.abs(value);
};

export const ChartCell: VFC<FixedCellProps> = memo(({ row }) => {
  const chartDataSet = dates.map((dateKey: string) => getValue(row, dateKey));
  const max = Math.max(...chartDataSet);

  return (
    <Chart
      className={styles.chart}
      series={[{
        data: chartDataSet,
      }]}
      width={200}
      height={40}
      scaleX={{
        paddingEnd: 0.1,
        paddingStart: 0.1,
      }}
      scaleY={{
        paddingTop: 5,
        paddingBottom: 5,
      }}
    >
      <Ticks
        lineLength="100%"
        lineVisible
        position="top"
        lineStyle={{
          stroke: 'lightgray',
          strokeDasharray: 4,
        }}
        labelVisible={false}
        axis="x"
        ticks={yearTicks}
      />
      {
        isNonAbsoluteRow(row) && (
          <Ticks
            lineLength="100%"
            lineVisible
            position="top"
            lineStyle={{
              stroke: 'lightgray',
            }}
            labelVisible={false}
            axis="y"
            ticks={[0]}
          />
        )
      }
      <Lines
        interpolation="linear"
        lineWidth={1}
      />
      <Ticks
        lineVisible={false}
        position="top"
        labelVisible
        axis="y"
        ticks={[max]}
        labelFormat={formatLabel}
        labelStyle={{
          fill: 'silver',
          dominantBaseline: 'hanging',
          fontSize: 10,
          enableBackground: true,
          // backgroundColor: 'white',
        }}
        // labelAttributes={{
        //   y: 10,
        // }}
      />
    </Chart>
  );
});

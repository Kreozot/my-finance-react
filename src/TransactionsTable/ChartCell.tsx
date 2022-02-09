import { memo, VFC } from 'react';
import { CellProps } from 'react-table';
import { Chart, Lines, Ticks } from 'rumble-charts';

import { dates, RowData } from '../store';

const yearTicks = dates.reduce((result, dateKey: string, index: number) => {
  const month = dateKey.slice(5, 7);
  if (month === '01') {
    result.push(index);
  }
  return result;
}, [] as number[]);

export const ChartCell: VFC<CellProps<RowData>> = memo(({ row }) => {
  const chartDataSet = row.original
    ? dates.map((dateKey: string) => Math.abs(row.original.transactions[dateKey] || 0))
    : dates.map((dateKey: string) => Math.abs(row.values[dateKey] || 0));
  return (
    <Chart
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
      <Lines
        interpolation="linear"
        lineWidth={1}
        minY={0}
      />
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
    </Chart>
  );
});

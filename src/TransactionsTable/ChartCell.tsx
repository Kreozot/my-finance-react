import { memo, VFC } from 'react';
import { CellProps } from 'react-table';
import { Chart, Lines } from 'rumble-charts';

import { dates, RowData } from '../data-transform';

const ChartCell: VFC<CellProps<RowData>> = ({ row }) => {
  const chartDataSet = dates.map((dateKey: string) => Math.abs(row.values?.[dateKey]));
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
    </Chart>
  );
};
export default memo(ChartCell);

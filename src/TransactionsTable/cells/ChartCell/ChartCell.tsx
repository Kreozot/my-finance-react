import { memo, useMemo, VFC } from 'react';

import { dates } from 'store';
import { FixedCellProps, FixedRow } from '../../data-table';
import { isNonAbsoluteRow } from '../../tableUtils';

import { Chart } from './Chart';

const getValue = (row: FixedRow, dateKey: string) => {
  const value: number = row.original
    ? row.original.transactions[dateKey] || 0
    : row.values[dateKey] || 0;
  return isNonAbsoluteRow(row)
    ? value
    : Math.abs(value);
};

export const ChartCell: VFC<FixedCellProps> = memo(({ row }) => {
  const values = dates.map((dateKey: string) => getValue(row, dateKey));
  const valuesHash = values.join(';');

  const chartDataSet = useMemo(() => {
    return values;
  // eslint-disable-next-line react-hooks/exhaustive-deps -- Мемоизация массива по набору значений
  }, [valuesHash]);

  return (
    <Chart
      chartDataSet={chartDataSet}
      isNonAbsolute={isNonAbsoluteRow(row)}
    />
  );
});

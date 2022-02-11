import { memo, VFC } from 'react';
import { CellProps } from 'react-table';

import { RowData } from '../store';
import { getMostAverage, roundInteger } from '../money';
import { FixedRow } from './data-table';
import { MoneyCell } from './MoneyCell';

const MEANINGFULL_LIMIT = 100;
const LAST_MONTHS_COUNT = 12;

const getMoneyDataFromRow = (row: FixedRow, trimStart: boolean = false) => {
  let firstOccurrence = false;
  const result = Object.keys(row.values)
    .filter((key) => /\d\d\d\d-\d\d/.test(key))
    .sort()
    .slice(-LAST_MONTHS_COUNT)
    .map((key) => row.values[key] || 0 as number);
  if (trimStart) {
    return result
      .filter((value) => {
        if (firstOccurrence) {
          return true;
        }
        if (value) {
          firstOccurrence = true;
          return true;
        }
        return false;
      });
  }
  return result;
};

export const MeanCell: VFC<CellProps<RowData>> = memo(({ row }) => {
  const data = getMoneyDataFromRow(row as FixedRow, true);
  const mostAverage = getMostAverage(data);
  if (Math.abs(mostAverage) < MEANINGFULL_LIMIT) {
    return null;
  }
  return (
    <MoneyCell value={roundInteger(mostAverage)} />
  );
});

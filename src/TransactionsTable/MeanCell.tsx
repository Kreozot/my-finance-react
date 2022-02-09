import { memo, VFC } from 'react';
import { CellProps } from 'react-table';

import { RowData } from '../store';
import { formatMoney, getMostAverage, roundInteger } from '../money';
import { FixedRow } from './data-table';
import MoneyCell from './MoneyCell';

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

const MeanCell: VFC<CellProps<RowData>> = ({ row }) => {
  const data = getMoneyDataFromRow(row as FixedRow, true);
  const mostAverage = getMostAverage(data);
  if (mostAverage < MEANINGFULL_LIMIT) {
    return null;
  }
  return (
    <MoneyCell value={roundInteger(mostAverage)} />
  );
};

export default memo(MeanCell);

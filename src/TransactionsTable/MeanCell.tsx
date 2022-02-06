import { memo, VFC } from 'react';
import { CellProps } from 'react-table';

import { RowData } from '../data-transform';
import { formatMoney, mostAverage as getMostAverage, roundInteger } from '../money';
import { FixedRow } from './data-table';

const MEANINGFULL_LIMIT = 100;

const getMoneyDataFromRow = (row: FixedRow, trimStart: boolean = false) => {
  let firstOccurrence = false;
  const result = Object.keys(row.values)
    .filter((key) => /\d\d\d\d-\d\d/.test(key))
    .sort()
    .map((key) => row.values[key]);
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
  const mostAverage = getMostAverage(getMoneyDataFromRow(row as FixedRow, true));
  if (mostAverage < MEANINGFULL_LIMIT) {
    return null;
  }
  return (
    <>
      {formatMoney(roundInteger(mostAverage))}
    </>
  );
};

export default memo(MeanCell);

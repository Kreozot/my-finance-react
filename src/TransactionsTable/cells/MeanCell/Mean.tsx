import { memo, VFC } from 'react';

import { getMostAverage, roundInteger } from 'money';
import { findIndex, findLastIndex } from 'lodash';
import { FixedRow } from '../../data-table';
import { MoneyCell } from '../MoneyCell';

const MEANINGFULL_LIMIT = 100;
const LAST_MONTHS_COUNT = 12;
const DATE_KEY_REGEXP = /\d\d\d\d-\d\d/;

export const getMoneyDataFromRow = (row: FixedRow, sliceLastMonths: boolean, trimStart: boolean, trimEnd: boolean) => {
  let result = Object.keys(row.values)
    .filter((key) => DATE_KEY_REGEXP.test(key))
    .sort()
    .map((key) => (row.values[key] || 0) as number);

  if (sliceLastMonths) {
    result = result.slice(-LAST_MONTHS_COUNT);
  }

  if (trimStart) {
    const firstOccurrenceIndex = findIndex(result, (value) => Boolean(value));
    result = result.slice(firstOccurrenceIndex);
  }

  if (trimEnd) {
    const lastOccurrenceIndex = findLastIndex(result, (value) => Boolean(value));
    result = result.slice(0, 1 + lastOccurrenceIndex);
  }

  return result;
};

type MeanCellProps = {
  data: number[];
};

export const MeanCell: VFC<MeanCellProps> = memo(({ data }) => {
  const mostAverage = getMostAverage(data);
  if (Math.abs(mostAverage) < MEANINGFULL_LIMIT) {
    return null;
  }
  return (
    <MoneyCell value={roundInteger(mostAverage)} />
  );
});

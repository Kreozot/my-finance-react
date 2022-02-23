import { decodeCategory } from 'convertData';
import { CategoryType } from 'types';
import { FixedRow } from './data-table';

const SUMMARY_ROWS_COUNT = 3;

export const isNonAbsoluteRow = (row?: FixedRow) => {
  const categoryCode = row?.values?.categoryCode;
  if (categoryCode) {
    return decodeCategory(categoryCode).categoryType === CategoryType.Both;
  }
  return false;
};

export const isIncomeRow = (row?: FixedRow) => {
  const categoryCode = row?.values?.categoryCode;
  if (categoryCode) {
    return decodeCategory(categoryCode).categoryType === CategoryType.Income;
  }
};

export const isSummaryRow = (row: FixedRow) => {
  return row.index < SUMMARY_ROWS_COUNT;
};

import { FixedRow } from './data-table';

const SUMMARY_ROWS_COUNT = 3;

export const isNonAbsoluteRow = (row?: FixedRow) => {
  return row?.values?.category?.slice(-1) === '2';
};

export const isIncomeRow = (row?: FixedRow) => {
  return row?.values?.category?.slice(-1) === '1';
};

export const isSummaryRow = (row: FixedRow) => {
  return row.index < SUMMARY_ROWS_COUNT;
};

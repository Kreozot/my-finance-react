import { FixedRow } from './data-table';

export const isNonAbsoluteRow = (row?: FixedRow) => {
  return row?.values?.category?.slice(-1) === '2';
};

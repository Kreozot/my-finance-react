/* eslint-disable no-param-reassign */
import { uniq, flatten } from 'lodash';

import tableIncome from './tableIncome.json';
import tableExpenses from './tableExpenses.json';
import { TableTransaction } from './types';

export type RowData = TableTransaction & {
  isIncome: boolean;
  groupingKey: string;
};

export const data = [
  ...(tableIncome as unknown as RowData[]).map((entry) => {
    entry.isIncome = true;
    entry.groupingKey = `${entry.category}-1`;
    return entry;
  }),
  ...(tableExpenses as unknown as RowData[]).map((entry) => {
    entry.isIncome = false;
    entry.groupingKey = `${entry.category}-0`;
    return entry;
  }),
];

export const dates: string[] = uniq(
  flatten(
    data.map((entry) => Object.keys(entry.transactions)),
  ),
).sort();

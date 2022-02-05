import { uniq, flatten } from 'lodash';

import originalData from './table.json';
import { TableTransaction } from './types';

export type RowData = {
  category: string,
  name: string,
  [dateKey: string]: string,
};

export const data = (originalData as TableTransaction[])
  .map((entry) => ({
    category: entry.category,
    name: entry.name,
    ...entry.transactions,
  } as RowData));

export const dates = uniq(
  flatten(
    originalData.map((entry) => Object.keys(entry.transactions))
  )
).sort();

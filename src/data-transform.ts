import { uniq, flatten } from 'lodash';

import originalData from './table.json';
import { TableTransaction } from './types';

export type RowData = TableTransaction;

export const data = (originalData as unknown as RowData[]);

export const dates = uniq(
  flatten(
    (originalData as unknown as TableTransaction[]).map((entry) => Object.keys(entry.transactions)),
  ),
).sort();

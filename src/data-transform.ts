import { uniq, flatten } from 'lodash';

import originalData from './table.json';
import { TableTransaction } from './types';

export const data = (originalData as TableTransaction[]).map((entry) => ({
  category: entry.category,
  name: entry.name,
  ...entry.transactions,
})) as {
  category: string,
  name: string,
  [dateKey: string]: string,
}[];

export const dates = uniq(flatten(originalData.map((entry) => Object.keys(entry.transactions))));

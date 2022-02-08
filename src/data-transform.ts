/* eslint-disable max-classes-per-file -- TODO Исправить */
/* eslint-disable no-param-reassign */
import { uniq, flatten } from 'lodash';
import { computed, makeAutoObservable } from 'mobx';

import tableIncome from './data/tableIncome.json';
import tableExpenses from './data/tableExpenses.json';
import { DateSumMap, TableTransaction } from './types';

// export type RowData = TableTransaction & {
//   isIncome: boolean;
// };

export class RowData {
  category: string;

  name: string;

  transactions: DateSumMap;

  isIncome: boolean;

  isHidden: boolean = false;

  constructor(transaction: TableTransaction, isIncome: boolean) {
    this.category = `${transaction.category}-${isIncome ? 1 : 0}`;
    this.name = transaction.name;
    this.transactions = transaction.transactions;
    this.isIncome = isIncome;
    makeAutoObservable(this);
  }

  hide() {
    this.isHidden = true;
  }

  show() {
    this.isHidden = false;
  }
}

class TableData {
  pureData: RowData[];

  hiddenCategories: Set<string> = new Set();

  constructor(data: RowData[]) {
    this.pureData = data;
    makeAutoObservable(this, {
      data: computed,
    });
  }

  get data() {
    return this.pureData.filter(({ category }) => !this.hiddenCategories.has(category));
  }

  hideCategory(category: string) {
    this.hiddenCategories.add(category);
  }
}

export const tableData = new TableData([
  ...(tableIncome as unknown as TableTransaction[]).map((entry) => new RowData(entry, true)),
  ...(tableExpenses as unknown as TableTransaction[]).map((entry) => new RowData(entry, false)),
]);

// export const hideCategory = (categoryName: string) => {
//   data.forEach((rowData) => {
//     if (rowData.category === categoryName) {
//       rowData.hide();
//     }
//   });
// };

export const dates: string[] = uniq(
  flatten(
    tableData.data.map((entry) => Object.keys(entry.transactions)),
  ),
).sort();

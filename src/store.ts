/* eslint-disable max-classes-per-file -- TODO Исправить */
/* eslint-disable no-param-reassign */
import { uniq, flatten } from 'lodash';
import { autorun, computed, makeAutoObservable } from 'mobx';

import tableIncome from './data/tableIncome.json';
import tableExpenses from './data/tableExpenses.json';
import { DateSumMap, TableTransaction } from './types';

const initialHiddenCategories = JSON.parse(localStorage.getItem('hiddenCategories') || '[]');

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

  hiddenCategories: Set<string> = new Set(initialHiddenCategories);

  constructor(data: RowData[]) {
    this.pureData = data;
    makeAutoObservable(this, {
      data: computed,
      isCategoryHidden: false,
    });
  }

  get data() {
    return this.pureData.filter(({ category }) => !this.hiddenCategories.has(category));
  }

  hideCategory(category: string) {
    this.hiddenCategories.add(category);
  }

  showCategory(category: string) {
    this.hiddenCategories.delete(category);
  }

  isCategoryHidden(category: string) {
    return this.hiddenCategories.has(category);
  }
}

export const tableData = new TableData([
  ...(tableIncome as unknown as TableTransaction[]).map((entry) => new RowData(entry, true)),
  ...(tableExpenses as unknown as TableTransaction[]).map((entry) => new RowData(entry, false)),
]);

autorun(() => {
  localStorage.setItem('hiddenCategories', JSON.stringify(tableData.hiddenCategories));
});

export const dates: string[] = uniq(
  flatten(
    tableData.data.map((entry) => Object.keys(entry.transactions)),
  ),
).sort();

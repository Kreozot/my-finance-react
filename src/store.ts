/* eslint-disable max-classes-per-file -- TODO Исправить */
/* eslint-disable no-param-reassign */
import {
  uniq, flatten, minBy, groupBy,
} from 'lodash';
import { autorun, computed, makeAutoObservable } from 'mobx';

import tableIncome from './data/tableIncome.json';
import tableExpenses from './data/tableExpenses.json';
import { DateSumMap, TableTransaction } from './types';

const initialHiddenCategories = JSON.parse(localStorage.getItem('hiddenCategories') || '[]');

export const dates: string[] = uniq(
  flatten(
    [...tableIncome, ...tableExpenses].map((entry) => Object.keys(entry.transactions)),
  ),
).sort();

const datesByYears = groupBy(dates, (dateKey) => dateKey.slice(0, 4));
export const firstMonthKeys = Object.keys(datesByYears).map((year) => {
  return minBy(datesByYears[year], (dateKey) => dateKey.slice(-2));
});

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
      incomeSumRow: computed,
      expensesSumRow: computed,
      tableRows: computed,
    });
  }

  get data() {
    return this.pureData.filter(({ category }) => !this.hiddenCategories.has(category));
  }

  get tableRows() {
    return [
      this.incomeSumRow,
      this.expensesSumRow,
      ...this.pureData,
    ];
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

  static calculateSumRow(data: RowData[], title: string): RowData {
    return data.reduce((result, entry) => {
      dates.forEach((dateKey) => {
        result.transactions[dateKey] = (result.transactions[dateKey] || 0) + (entry.transactions[dateKey] || 0);
      });
      return result;
    }, {
      category: title,
      name: '',
      transactions: {},
    } as RowData);
  }

  get incomeSumRow() {
    return TableData.calculateSumRow(this.data.filter(({ isIncome }) => isIncome), 'Доход-1');
  }

  get expensesSumRow() {
    return TableData.calculateSumRow(this.data.filter(({ isIncome }) => !isIncome), 'Расход-0');
  }
}

export const tableData = new TableData([
  ...(tableIncome as unknown as TableTransaction[]).map((entry) => new RowData(entry, true)),
  ...(tableExpenses as unknown as TableTransaction[]).map((entry) => new RowData(entry, false)),
]);

autorun(() => {
  localStorage.setItem('hiddenCategories', JSON.stringify(tableData.hiddenCategories));
});

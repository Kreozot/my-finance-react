/* eslint-disable max-classes-per-file -- TODO Исправить */
/* eslint-disable no-param-reassign */
import {
  uniq, minBy, groupBy,
} from 'lodash';
import { autorun, makeAutoObservable } from 'mobx';
import { getRowData } from './convertData';

import transactionsData from './data/allTransactions.json';
import { RowData, Transaction } from './types';

const initialHiddenCategories = JSON.parse(localStorage.getItem('hiddenCategories') || '[]');

export const dates: string[] = uniq(
  transactionsData.map((entry) => entry.dateKey),
).sort();

const datesByYears = groupBy(dates, (dateKey) => dateKey.slice(0, 4));
export const firstMonthKeys = Object.keys(datesByYears).map((year) => {
  return minBy(datesByYears[year], (dateKey) => dateKey.slice(-2));
});

class TableData {
  transactions: Transaction[];

  hiddenCategories: Set<string> = new Set(initialHiddenCategories);

  constructor(transactions: Transaction[]) {
    this.transactions = transactions;
    makeAutoObservable(this);
  }

  get incomeTransactions() {
    return this.transactions.filter((transaction) => transaction.amount > 0);
  }

  get expenseTransactions() {
    return this.transactions.filter((transaction) => transaction.amount < 0);
  }

  get incomeRowData() {
    return getRowData(this.incomeTransactions, true);
  }

  get expenseRowData() {
    return getRowData(this.expenseTransactions, false);
  }

  get tableRows() {
    return [
      this.incomeSumRow,
      this.expensesSumRow,
      this.marginSumRow,
      ...this.incomeRowData,
      ...this.expenseRowData,
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
    return TableData.calculateSumRow(this.incomeRowData, 'Доход-1');
  }

  get expensesSumRow() {
    return TableData.calculateSumRow(this.expenseRowData, 'Расход-0');
  }

  get marginSumRow() {
    return TableData.calculateSumRow([this.incomeSumRow, this.expensesSumRow], 'Остаток-2');
  }
}

export const tableData = new TableData(transactionsData as unknown as Transaction[]);

autorun(() => {
  localStorage.setItem('hiddenCategories', JSON.stringify(tableData.hiddenCategories));
});

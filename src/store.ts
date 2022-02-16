/* eslint-disable no-param-reassign */
import {
  uniq, minBy, groupBy,
} from 'lodash';
import { autorun, makeAutoObservable } from 'mobx';
import { getRowData } from './convertData';

import transactionsData from './data/allTransactions.json';
import { RowData, Transaction } from './types';

const initialHiddenCategories = JSON.parse(localStorage.getItem('hiddenCategories') || '[]');
const initialTransformers = JSON.parse(localStorage.getItem('transformers') || '[]');

export const dates: string[] = uniq(
  transactionsData.map((entry) => entry.dateKey),
).sort();

const datesByYears = groupBy(dates, (dateKey) => dateKey.slice(0, 4));
export const firstMonthKeys = Object.keys(datesByYears).map((year) => {
  return minBy(datesByYears[year], (dateKey) => dateKey.slice(-2));
});

export type Transformer = {
  byCategoryName: boolean;
  byItemName: boolean;
  categoryName: string;
  itemName: string;
  newCategoryName: string;
  newItemName: string;
};

class TableData {
  transactions: Transaction[];

  hiddenCategories: Set<string> = new Set(initialHiddenCategories);

  transformers: Transformer[] = initialTransformers;

  constructor(transactions: Transaction[]) {
    this.transactions = transactions;
    makeAutoObservable(this);
  }

  transformTransaction(transaction: Transaction): Transaction {
    const transformer = this.transformers.find((tempTransformer) => {
      if (!tempTransformer.byCategoryName && !tempTransformer.byItemName) {
        return false;
      }
      const passByCategoryName = (!tempTransformer.byCategoryName
        || tempTransformer.categoryName === transaction.category);
      const passByItemName = (!tempTransformer.byItemName
        || tempTransformer.itemName === transaction.name);
      return passByCategoryName && passByItemName;
    });
    if (transformer) {
      return {
        ...transaction,
        category: transformer.newCategoryName || transaction.category,
        name: transformer.newItemName || transaction.name,
      };
    }
    return transaction;
  }

  /** Список названий категорий, запрещённых к выбору в качестве условий для преобразования.
   * Это условие требуется для обеспечения однопроходности цикла преобразований,
   * Чтобы не преобразовывать то, во что уже преобразуется что-то другое.
   */
  get forbiddenToTransformCategoryNames() {
    return this.transformers.map((transformer) => transformer.newCategoryName);
  }

  /** Список названий переводов, запрещённых к выбору в качестве условий для преобразования */
  get forbiddenToTransformItemNames() {
    return this.transformers.map((transformer) => transformer.newItemName);
  }

  addTransformer(transformer: Transformer) {
    if ((transformer.byCategoryName && this.forbiddenToTransformCategoryNames.includes(transformer.categoryName))
      || (transformer.byItemName && this.forbiddenToTransformCategoryNames.includes(transformer.itemName))) {
      throw new Error('Запрещено добавление в качестве условий полей, в которые преобразуются другие записи');
    }
    this.transformers.push(transformer);
  }

  get incomeTransactions() {
    return this.transactions
      .filter((transaction) => transaction.amount > 0)
      .map(this.transformTransaction.bind(this));
  }

  get expenseTransactions() {
    return this.transactions
      .filter((transaction) => transaction.amount < 0)
      .map(this.transformTransaction.bind(this));
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

  hideCategory(categoryName: string) {
    this.hiddenCategories.add(categoryName);
  }

  showCategory(categoryName: string) {
    this.hiddenCategories.delete(categoryName);
  }

  isCategoryHidden(categoryName: string) {
    return this.hiddenCategories.has(categoryName);
  }

  static calculateSumRow(data: RowData[], title: string): RowData {
    return data.reduce((result, entry) => {
      dates.forEach((dateKey) => {
        result.transactions[dateKey] = (result.transactions[dateKey] || 0) + (entry.transactions[dateKey] || 0);
      });
      return result;
    }, {
      categoryName: title,
      itemName: '',
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

autorun(() => {
  localStorage.setItem('transformers', JSON.stringify(tableData.transformers));
});

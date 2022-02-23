/* eslint-disable no-param-reassign */
import {
  uniq, minBy, groupBy, sortBy, remove,
} from 'lodash';
import { autorun, makeAutoObservable } from 'mobx';
import getHash from 'object-hash';

import { loadSetting, saveSetting, Setting } from 'settingsStorage';
import { getCategoryCode, getRowData } from './convertData';

import transactionsData from './data/allTransactions.json';
import { CategoryType, RowData, Transaction } from './types';

const EXCLUDE_HIDDEN_CATEGORIES_FROM_SUM_ROWS = true;

const initialHiddenCategories = loadSetting(Setting.HiddenCategories) || [];
const initialTransformers = loadSetting(Setting.Transformers) || [];

export const dates: string[] = uniq(
  transactionsData.map((entry) => entry.dateKey),
).sort();

const datesByYears = groupBy(dates, (dateKey) => dateKey.slice(0, 4));
export const firstMonthKeys = Object.keys(datesByYears).map((year) => {
  return minBy(datesByYears[year], (dateKey) => dateKey.slice(-2));
});

/** Преобразователь транзакции
 *
 * Меняет поля транзакции если она соответствует условиям проверки
 */
export type Transformer = {
  /** Идентификатор трансформации */
  id?: string;
  /** Тип категории */
  categoryType?: CategoryType;
  /** Название категории */
  categoryName?: string;
  /** Название перевода */
  itemName?: string;
  /** RegExp названия перевода */
  itemNameRegExp?: RegExp;
  /** Новое название категории */
  newCategoryName?: string;
  /** Новое название перевода */
  newItemName?: string;
};

class TableData {
  /** Исходный список транзакций */
  transactions: Transaction[];

  /** Список кодов категорий, скрытых пользователем */
  hiddenCategories: Set<string> = new Set(initialHiddenCategories);

  /** Список преобразователей транзакций */
  transformers: Transformer[] = initialTransformers;

  constructor(transactions: Transaction[]) {
    this.transactions = transactions;
    makeAutoObservable(this);
  }

  transformTransaction(transaction: Transaction): Transaction {
    const transformer = this.transformers.find((tempTransformer) => {
      if (!tempTransformer.categoryName && !tempTransformer.itemName && !tempTransformer.itemNameRegExp) {
        return false;
      }
      const passByCategoryName = (!tempTransformer.categoryName
        || tempTransformer.categoryName === transaction.category);
      const passByItemName = (!tempTransformer.itemName
        || tempTransformer.itemName === transaction.name);
      const passByItemNameRegExp = (!tempTransformer.itemNameRegExp
        || tempTransformer.itemNameRegExp.test(transaction.name));
      return passByCategoryName && passByItemName && passByItemNameRegExp;
    });
    // TODO: Использование вхождений ($1) при замене имени, найденного по регулярному выражению
    if (transformer) {
      return {
        ...transaction,
        category: transformer.newCategoryName || transaction.category,
        name: transformer.newItemName || transaction.name,
        transformerId: transformer.id,
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

  deleteTransformer(transformerId: string) {
    remove(this.transformers, ({ id }) => id === transformerId);
  }

  addTransformer(transformer: Transformer) {
    if ((transformer.categoryName && this.forbiddenToTransformCategoryNames.includes(transformer.categoryName))
      || (transformer.itemName && this.forbiddenToTransformItemNames.includes(transformer.itemName))) {
      throw new Error('Запрещено добавление в качестве условий полей, в которые преобразуются другие записи');
    }
    if (!transformer.newCategoryName && !transformer.newItemName) {
      return;
    }
    if (!transformer.categoryName && !transformer.itemName && !transformer.itemNameRegExp) {
      return;
    }
    transformer.id = getHash(transformer, { algorithm: 'sha1' });
    this.transformers.push(transformer);
  }

  get incomeTransactions() {
    return sortBy(
      this.transactions
        .filter((transaction) => transaction.amount > 0)
        .map(this.transformTransaction.bind(this)),
      ['category', 'name'],
    );
  }

  get expenseTransactions() {
    return sortBy(
      this.transactions
        .filter((transaction) => transaction.amount < 0)
        .map(this.transformTransaction.bind(this)),
      ['category', 'name'],
    );
  }

  get incomeRowData() {
    return getRowData(this.incomeTransactions, true);
  }

  get expenseRowData() {
    return getRowData(this.expenseTransactions, false);
  }

  get incomeCategories() {
    return uniq(this.incomeRowData.map(({ categoryName }) => categoryName));
  }

  get expenseCategories() {
    return uniq(this.expenseRowData.map(({ categoryName }) => categoryName));
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

  hideCategory(categoryCode: string) {
    this.hiddenCategories.add(categoryCode);
  }

  showCategory(categoryCode: string) {
    this.hiddenCategories.delete(categoryCode);
  }

  isCategoryHidden(categoryCode: string) {
    return this.hiddenCategories.has(categoryCode);
  }

  calculateSumRow(data: RowData[], categoryName: string, categoryType: CategoryType): RowData {
    return data.reduce((result, entry) => {
      if (!EXCLUDE_HIDDEN_CATEGORIES_FROM_SUM_ROWS || !this.hiddenCategories.has(entry.categoryCode)) {
        dates.forEach((dateKey) => {
          result.transactions[dateKey] = (result.transactions[dateKey] || 0) + (entry.transactions[dateKey] || 0);
        });
      }
      return result;
    }, {
      categoryName,
      categoryCode: getCategoryCode(categoryName, categoryType),
      itemName: '',
      transactions: {},
    } as RowData);
  }

  get incomeSumRow() {
    return this.calculateSumRow(this.incomeRowData, 'Доход', CategoryType.Income);
  }

  get expensesSumRow() {
    return this.calculateSumRow(this.expenseRowData, 'Расход', CategoryType.Expense);
  }

  get marginSumRow() {
    return this.calculateSumRow([this.incomeSumRow, this.expensesSumRow], 'Остаток', CategoryType.Both);
  }
}

export const tableData = new TableData(transactionsData as unknown as Transaction[]);

autorun(() => {
  saveSetting(Setting.HiddenCategories, tableData.hiddenCategories);
});

autorun(() => {
  saveSetting(Setting.Transformers, tableData.transformers);
});

import {
  groupBy, mapValues, values, flatten, uniq,
} from 'lodash';

import {
  CategoryType,
  DateSumMap, RowData, Transaction,
} from './types';

const OUT_CURRENCY = 'RUB';

const convertMoney = (amount: number, currency: string): number => {
  if (currency !== OUT_CURRENCY) {
    // eslint-disable-next-line no-console
    console.warn(`Отличающаяся валюта ${currency}`);
  }
  // TODO: Конвертация валюты
  return amount;
};

export const getCategoryCode = (categoryName: string, categoryType: CategoryType): string => {
  return `${categoryName}-${categoryType}`;
};

export const decodeCategory = (categoryCode: string): { categoryType: CategoryType, categoryName: string } => {
  const categoryType = Number(categoryCode.slice(-1)) as CategoryType;
  if (!Object.values(CategoryType)?.includes(categoryType)) {
    throw new Error(`Значение ${categoryCode.slice(-1)} не является типом категории`);
  }
  return {
    categoryType,
    categoryName: categoryCode.slice(0, -2),
  };
};

// TODO: Группировать по категории и имени в один проход
// TODO: Рассмотреть перенос группировки полностью в таблицу
export const getRowData = (originalTransactions: Transaction[], isIncome: boolean): RowData[] => {
  const categoryGroups = groupBy(originalTransactions, 'category');
  const categoryNameGroups = mapValues(categoryGroups, (categoryGroup, categoryName): RowData[] => {
    const nameGroups = groupBy(categoryGroup, 'name');
    const nameDateGroups = mapValues(nameGroups, (nameGroup, itemName): RowData => {
      const dateGroups = groupBy(nameGroup, 'dateKey');
      const transactionsSummary: DateSumMap = mapValues(dateGroups, (transactions): number => {
        const sum = transactions.reduce((result, transaction) => {
          return result + convertMoney(transaction.amount, transaction.currency);
        }, 0);
        return Math.round(sum);
      });
      const categoryType = isIncome ? CategoryType.Income : CategoryType.Expense;
      const banks = uniq(nameGroup.map(({ bank }) => bank));
      const categoryCode = getCategoryCode(categoryName, categoryType);
      return {
        id: `${categoryCode}:${itemName}`,
        categoryName,
        categoryType,
        categoryCode,
        itemName,
        transactions: transactionsSummary,
        banks,
      };
    });
    return values(nameDateGroups);
  });

  return flatten(values(categoryNameGroups));
};

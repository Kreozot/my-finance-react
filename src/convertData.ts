import {
  groupBy, mapValues, values, flatten,
} from 'lodash';

import {
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

// TODO: Группировать по категории и имени в один проход
export const getRowData = (originalTransactions: Transaction[], isIncome: boolean): RowData[] => {
  const categoryGroups = groupBy(originalTransactions, 'category');
  const categoryNameGroups = mapValues(categoryGroups, (categoryGroup, category): RowData[] => {
    const nameGroups = groupBy(categoryGroup, 'name');
    const nameDateGroups = mapValues(nameGroups, (nameGroup, name): RowData => {
      const dateGroups = groupBy(nameGroup, 'dateKey');
      const transactionsSummary: DateSumMap = mapValues(dateGroups, (transactions): number => {
        const sum = transactions.reduce((result, transaction) => {
          return result + convertMoney(transaction.amount, transaction.currency);
        }, 0);
        return Math.round(sum);
      });
      return {
        category: category + (isIncome ? '-1' : '-0'),
        name,
        transactions: transactionsSummary,
      };
    });
    return values(nameDateGroups);
  });

  return flatten(values(categoryNameGroups));
};

export type Transaction = {
  hash?: string,
  /** Дата и время */
  date: Date,
  /** Ключ даты для группировки данных (год-месяц) */
  dateKey: string,
  /** Сумма */
  amount: number,
  /** Название */
  name: string,
  /** Категория */
  category: string,
  /** Код валюты */
  currency: string,
};

export type TransactionsSum = {
  /** Сумма */
  sum: number,
  /** Код валюты */
  currency: string,
};

export type DateSumMap = {
  [dateKey: string]: number,
};

export type RowData = {
  categoryName: string,
  itemName: string,
  transactions: DateSumMap,
};

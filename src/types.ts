export enum CategoryType {
  Expense = 0,
  Income = 1,
  Both = 2,
}

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
  /** Название категории */
  categoryName: string,
  categoryType: CategoryType,
  /** Внутренний код категории для группировки таблицы
   *
   * Постфикс -0 для расходов, -1 для доходов, -2 для строк с отображением отрицательных значений
   */
  categoryCode: string,
  /** Название перевода */
  itemName: string,
  /** Суммы транзакций по месяцам */
  transactions: DateSumMap,
};

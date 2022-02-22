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
  /** Банк, где выполнена операция */
  bank: Bank,
  /** Идентификатор трансформации, которая была применена к записи */
  transformerId?: string,
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
  id: string,
  /** Название категории */
  categoryName: string,
  /** Тип категории. -0 для расходов, -1 для доходов, -2 для строк с отображением отрицательных значений */
  categoryType: CategoryType,
  /** Внутренний код категории для группировки таблицы (название + код) */
  categoryCode: string,
  /** Название перевода */
  itemName: string,
  /** Суммы транзакций по месяцам */
  transactions: DateSumMap,
  /** Банки, в которых были переводы с таким названием */
  banks: Bank[],
  /** Массив идентификаторов трансформаций, применённым к транзакциям в строке */
  transformerIds?: string[],
};

export enum Bank {
  Tinkoff = 'tinkoff',
  Sberbank = 'sberbank',
  Alfabank = 'alfabank',
}

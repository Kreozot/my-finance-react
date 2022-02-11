import { memo, VFC } from 'react';
import { CellProps } from 'react-table';

import { RowData } from '../store';
import { formatMoney } from '../money';

import styles from './MoneyCell.module.scss';

const MEANINGFULL_LIMIT = 100;

export const MoneyCell: VFC<Partial<CellProps<RowData>>> = memo(({ value }) => {
  const absValue = Math.abs(value || 0);
  const className = (absValue < MEANINGFULL_LIMIT) ? styles.secondary : '';
  return (
    <span className={`${className} ${styles.money}`}>
      {formatMoney(absValue)}
    </span>
  );
});

import { memo, VFC } from 'react';
import { CellProps } from 'react-table';

import { RowData } from '../store';
import { formatMoney } from '../money';

import styles from './MoneyCell.module.scss';

const MEANINGFULL_LIMIT = 100;

export const MoneyCell: VFC<Partial<CellProps<RowData>>> = memo(({ value }) => {
  const className = (Math.abs(value) < MEANINGFULL_LIMIT) ? styles.secondary : '';
  return (
    <span className={`${className} ${styles.money}`}>
      {formatMoney(value)}
    </span>
  );
});

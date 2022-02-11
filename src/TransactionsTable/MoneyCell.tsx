import { memo, VFC } from 'react';

import { formatMoney } from '../money';

import styles from './MoneyCell.module.scss';
import { isNonAbsoluteRow } from './tableUtils';
import { FixedCellProps } from './data-table';

const MEANINGFULL_LIMIT = 100;

export const MoneyCell: VFC<Partial<FixedCellProps>> = memo(({ value, row }) => {
  const absValue = Math.abs(value || 0);
  const className = (absValue < MEANINGFULL_LIMIT) ? styles.secondary : '';
  return (
    <span className={`${className} ${styles.money}`}>
      {formatMoney((isNonAbsoluteRow(row)) ? value : absValue)}
    </span>
  );
});

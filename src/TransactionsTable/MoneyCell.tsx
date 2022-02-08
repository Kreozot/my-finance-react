import { memo, VFC } from 'react';
import { CellProps } from 'react-table';

import { RowData } from '../data-transform';
import { formatMoney } from '../money';

import styles from './MoneyCell.module.scss';

const MEANINGFULL_LIMIT = 100;

const MoneyCell: VFC<Partial<CellProps<RowData>>> = ({ value }) => {
  const className = (Math.abs(value) < MEANINGFULL_LIMIT) ? styles.secondary : '';
  return (
    <span className={`${className} ${styles.money}`}>
      {formatMoney(value)}
    </span>
  );
};

export default memo(MoneyCell);

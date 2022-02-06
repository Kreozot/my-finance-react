import { memo, VFC } from 'react';
import { CellProps } from 'react-table';

import { RowData } from '../data-transform';
import { formatMoney } from '../money';

import styles from './MoneyCell.module.scss';

const MEANINGFULL_LIMIT = 100;

const MoneyCell: VFC<CellProps<RowData>> = ({ value }) => {
  const className = (Math.abs(value) < MEANINGFULL_LIMIT) ? styles.secondary : '';
  return (
    <span className={className}>
      {formatMoney(value)}
    </span>
  );
};

export default memo(MoneyCell);

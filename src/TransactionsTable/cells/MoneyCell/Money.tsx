import { memo, VFC } from 'react';

import { formatMoney } from 'money';
import classNames from 'classnames';

import styles from './MoneyCell.module.scss';

const MEANINGFULL_LIMIT = 100;

type MoneyProps = {
  value: number;
};

export const Money: VFC<MoneyProps> = memo(({ value }) => {
  return (
    <span
      className={classNames(styles.money, {
        [styles.secondary]: (value < MEANINGFULL_LIMIT) && (value > -MEANINGFULL_LIMIT),
      })}
    >
      {formatMoney(value)}
    </span>
  );
});

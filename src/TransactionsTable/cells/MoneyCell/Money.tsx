import { memo, VFC } from 'react';

import { formatMoney } from 'money';
import classNames from 'classnames';

import styles from './MoneyCell.module.scss';

// TODO: Limit depends of the currency
const MEANINGFULL_LIMIT = 5;

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
Money.displayName = 'Money';

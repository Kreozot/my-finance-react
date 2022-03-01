import { VFC, memo } from 'react';

import { Bank } from 'types';
import { ReactComponent as AlfabankIcon } from 'icons/alfabank.svg';
import { ReactComponent as SberbankIcon } from 'icons/sberbank.svg';
import { ReactComponent as TinkoffIcon } from 'icons/tinkoff.svg';

import styles from './BankIcon.module.scss';

type BankIconProps = {
  bank: Bank;
};

const icons = {
  [Bank.Alfabank]: AlfabankIcon,
  [Bank.Sberbank]: SberbankIcon,
  [Bank.Tinkoff]: TinkoffIcon,
};

export const BankIcon: VFC<BankIconProps> = memo((props) => {
  const { bank } = props;

  const Icon = icons[bank];

  return (
    <span className={styles.icon}>
      <Icon />
    </span>
  );
});
BankIcon.displayName = 'BankIcon';

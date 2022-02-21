import { VFC, memo, useMemo } from 'react';
import classNames from 'classnames';
import { ReactComponent as EditIcon } from '@material-design-icons/svg/filled/edit.svg';

import { Bank } from 'types';
import { IconButton } from 'components/IconButton';
import { categoryDialogState } from 'CategoryDialog/categoryDialogState';
import { BankIcon } from '../BankIcon';

import styles from './Item.module.scss';

type ItemProps = {
  categoryName: string,
  itemName: string,
  /** Сериализованный массив банков, чтобы мемоизировать функцию */
  banksString: string,
  isHidden: boolean,
};

export const Item: VFC<ItemProps> = memo((props) => {
  const {
    categoryName, itemName, banksString, isHidden,
  } = props;

  const banks = useMemo(() => {
    return banksString.split(';') as Bank[];
  }, [banksString]);

  const className = classNames(styles.name, { [styles.hidden]: isHidden });

  return (
    <span className={styles.nameCell}>
      <span className={styles.banks}>
        {banks.map((bank) => <BankIcon bank={bank} key={bank} />)}
      </span>
      <span className={className}>
        {itemName}
      </span>
      <IconButton
        title="Редактировать информацию"
        Icon={EditIcon}
        className={styles.editButton}
        onClick={() => {
          categoryDialogState.show(categoryName, itemName);
        }}
      />
    </span>
  );
});

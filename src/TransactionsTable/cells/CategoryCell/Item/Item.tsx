import {
  VFC, memo, useMemo, useCallback,
} from 'react';
import classNames from 'classnames';
import { ReactComponent as EditIcon } from '@material-design-icons/svg/filled/edit.svg';

import { Bank } from 'types';
import { IconButton } from 'components/IconButton';
import { categoryDialogState } from 'CategoryDialog';
import { transformerChoiceState } from 'TransformerChoice';
import { BankIcon } from '../BankIcon';

import styles from './Item.module.scss';

type ItemProps = {
  categoryName: string,
  itemName: string,
  /** Сериализованный массив банков, чтобы мемоизировать функцию */
  banksString: string,
  /** Сериализованный массив трансформаций, чтобы мемоизировать функцию */
  transformersString: string,
  isHidden: boolean,
};

export const Item: VFC<ItemProps> = memo((props) => {
  const {
    categoryName, itemName, banksString, isHidden, transformersString,
  } = props;

  const banks = useMemo(() => {
    return banksString.split(';') as Bank[];
  }, [banksString]);

  const transformers = useMemo(() => {
    return transformersString ? transformersString.split(';') : [];
  }, [transformersString]);

  const handleEditClick = useCallback(() => {
    if (transformers.length > 0) {
      if (transformers.length > 1) {
        transformerChoiceState.show(transformers);
      } else {
        categoryDialogState.edit(transformers[0]);
      }
    } else {
      categoryDialogState.add(categoryName, itemName);
    }
  }, [transformers, categoryName, itemName]);

  const className = classNames(styles.name, { [styles.hidden]: isHidden });

  return (
    <span className={classNames(styles.nameCell, {
      [styles.transformed]: Boolean(transformersString),
    })}
    >
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
        onClick={handleEditClick}
      />
    </span>
  );
});

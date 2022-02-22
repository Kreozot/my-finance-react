import { VFC, memo, useCallback } from 'react';
import { ReactComponent as EditIcon } from '@material-design-icons/svg/filled/edit.svg';
import { ReactComponent as DeleteIcon } from '@material-design-icons/svg/filled/delete.svg';
import { ReactComponent as ArrowIcon } from '@material-design-icons/svg/filled/arrow_forward.svg';

import { Transformer } from 'store';
import { IconButton } from 'components/IconButton';

import { categoryDialogState } from 'CategoryDialog';
import styles from './TransformerChoiceItem.module.scss';

type TransformerChoiceItemProps = {
  transformer: Transformer;
};

export const TransformerChoiceItem: VFC<TransformerChoiceItemProps> = memo((props) => {
  const { transformer } = props;

  const handleEditClick = useCallback(() => {
    // categoryDialogState.show(categoryName, itemName);
  }, []);

  const handleDeleteClick = useCallback(() => {

  }, []);

  return (
    <tr>
      <td className={styles.contentCell}>
        {transformer.categoryName && (
          <div>
            Категория <strong>{transformer.categoryName}</strong>
          </div>
        )}
        {transformer.itemName && (
          <div>
            Название перевода <strong>{transformer.itemName}</strong>
          </div>
        )}
        {transformer.itemNameRegExp && (
          <div>
            Название перевода (RegExp) <strong>{transformer.itemNameRegExp}</strong>
          </div>
        )}
      </td>
      <td>
        <ArrowIcon className={styles.arrow} />
      </td>
      <td className={styles.contentCell}>
        {transformer.newCategoryName && (
          <div>
            Категория <strong>{transformer.newCategoryName}</strong>
          </div>
        )}
        {transformer.newItemName && (
          <div>
            Название перевода <strong>{transformer.newItemName}</strong>
          </div>
        )}
      </td>
      <td>
        <IconButton
          Icon={EditIcon}
          title="Редактировать трансформацию"
          onClick={handleEditClick}
          className={styles.button}
        />
      </td>
      <td>
        <IconButton
          Icon={DeleteIcon}
          title="Удалить трансформацию"
          onClick={handleDeleteClick}
          className={styles.button}
        />
      </td>
    </tr>
  );
});

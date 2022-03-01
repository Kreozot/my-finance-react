import { VFC, memo, useCallback } from 'react';
import { ReactComponent as EditIcon } from '@material-design-icons/svg/filled/edit.svg';
import { ReactComponent as DeleteIcon } from '@material-design-icons/svg/filled/delete.svg';
import { ReactComponent as ArrowIcon } from '@material-design-icons/svg/filled/arrow_forward.svg';

import { tableData, Transformer } from 'store';
import { IconButton } from 'components/IconButton';

import { transformerEditDialogState } from 'TransformerEditDialog';
import { confirmationDialogState } from 'components/ConfirmationDialog';
import styles from './TransformerChoiceItem.module.scss';

type TransformerChoiceItemProps = {
  transformer: Transformer;
  isFirst: boolean;
  rowsCount: number;
};

const DELETE_CONFIRMATION_MESSAGE = 'Удалить трансформацию? Это не приведёт к удалению транзакций, к которым она была применена. Они просто начнут отображаться в исходном виде.';

export const TransformerChoiceItem: VFC<TransformerChoiceItemProps> = memo((props) => {
  const { transformer, isFirst, rowsCount } = props;

  const handleEditClick = useCallback(() => {
    if (transformer.id) {
      transformerEditDialogState.edit(transformer.id);
    }
  }, [transformer.id]);

  const handleDeleteClick = useCallback(() => {
    confirmationDialogState.confirm(DELETE_CONFIRMATION_MESSAGE, () => {
      if (transformer.id) {
        tableData.deleteTransformer(transformer.id);
      }
    });
  }, [transformer.id]);

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
      {
        isFirst
          && (
            <>
              <td rowSpan={rowsCount}>
                <ArrowIcon className={styles.arrow} />
              </td>
              <td className={styles.contentCell} rowSpan={rowsCount}>
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
            </>
          )
      }
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
TransformerChoiceItem.displayName = 'TransformerChoiceItem';

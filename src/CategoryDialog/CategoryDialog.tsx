import {
  useCallback, useEffect, useMemo, useState, VFC,
} from 'react';
import { observer } from 'mobx-react-lite';
import {
  Dialog, DialogActions, DialogContent, DialogButton,
} from '@rmwc/dialog';
import { FormField } from '@rmwc/formfield';

import { tableData } from 'store';
import { TextField } from 'components/TextField';
import { Checkbox } from 'components/Checkbox';
import { categoryDialogState } from './categoryDialogState';

import '@rmwc/formfield/styles';
import '@material/dialog/dist/mdc.dialog.css';
import '@material/button/dist/mdc.button.css';
import '@material/ripple/dist/mdc.ripple.css';

import styles from './CategoryDialog.module.scss';

type CategoryDialogProps = {

};

// TODO Возможность сбрасывать текстовые поля
export const CategoryDialog: VFC<CategoryDialogProps> = observer(() => {
  const {
    categoryName, itemName, isVisible,
  } = categoryDialogState;

  const [isCategoryChecked, setCategoryChecked] = useState(false);
  const [isItemChecked, setItemChecked] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState(categoryName);
  const [newItemName, setNewItemName] = useState(itemName);

  useEffect(() => {
    setNewCategoryName(categoryName);
  }, [categoryName]);

  useEffect(() => {
    setNewItemName(itemName);
  }, [itemName]);

  const handleClose = useCallback(({ detail: { action } }) => {
    if (action === 'accept') {
      tableData.addTransformer({
        byCategoryName: isCategoryChecked,
        byItemName: isItemChecked,
        categoryName,
        itemName,
        newCategoryName,
        newItemName,
      });
    }
    categoryDialogState.hide();
  }, [
    isCategoryChecked,
    isItemChecked,
    categoryName,
    itemName,
    newCategoryName,
    newItemName,
  ]);

  const isCategoryConditionDisabled = useMemo(() => {
    return tableData.forbiddenToTransformCategoryNames.includes(categoryName);
  }, [categoryName]);

  const isItemConditionDisabled = useMemo(() => {
    return tableData.forbiddenToTransformItemNames.includes(itemName);
  }, [itemName]);

  return (
    <Dialog
      open={isVisible}
      onClose={handleClose}
      onClosed={(evt) => console.log(evt.detail.action)}
    >
      <DialogContent>
        <h4>Условия</h4>
        <FormField>
          <Checkbox
            id="categoryCheck"
            label={<span>Название категории <strong>{categoryName}</strong></span>}
            checked={isCategoryChecked}
            onValueChange={setCategoryChecked}
            disabled={isCategoryConditionDisabled}
          />
        </FormField>
        <FormField>
          <Checkbox
            id="itemCheck"
            label={<span>Название перевода <strong>{itemName}</strong></span>}
            checked={isItemChecked}
            onValueChange={setItemChecked}
            disabled={isItemConditionDisabled}
          />
        </FormField>

        <h4>Трансформации</h4>
        <FormField>
          <span className={styles.fieldLabel}>Категория</span>
          <TextField
            value={newCategoryName}
            onValueChange={setNewCategoryName}
          />
        </FormField>
        <FormField>
          <span className={styles.fieldLabel}>Название перевода</span>
          <TextField
            value={newItemName}
            onValueChange={setNewItemName}
          />
        </FormField>
      </DialogContent>

      <DialogActions>
        <DialogButton action="close">
          Отмена
        </DialogButton>
        <DialogButton action="accept" isDefaultAction>
          Применить
        </DialogButton>
      </DialogActions>
    </Dialog>

  );
});

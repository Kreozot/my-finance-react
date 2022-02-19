import {
  useCallback, useEffect, useMemo, useState, VFC,
} from 'react';
import { observer } from 'mobx-react-lite';
import {
  Dialog, DialogActions, DialogContent, DialogButton, DialogOnCloseEventT,
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

const escapeRegExp = (text: string) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#]/g, '\\$&');
};

// TODO Возможность сбрасывать текстовые поля
export const CategoryDialog: VFC<CategoryDialogProps> = observer(() => {
  const {
    categoryName, itemName, isVisible,
  } = categoryDialogState;

  const [isCategoryChecked, setCategoryChecked] = useState(false);
  const [isItemChecked, setItemChecked] = useState(false);
  const [isItemRegExpChecked, setItemRegExpChecked] = useState(false);
  const [isNewCategoryChecked, setNewCategoryChecked] = useState(false);
  const [isNewItemChecked, setNewItemChecked] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState(categoryName);
  const [itemNameRegExp, setItemNameRegExp] = useState(itemName);
  const [newItemName, setNewItemName] = useState(itemName);

  useEffect(() => {
    setNewCategoryName(categoryName);
    setNewItemName(itemName);
    setItemNameRegExp(escapeRegExp(itemName));
    setCategoryChecked(false);
    setItemChecked(false);
    setItemRegExpChecked(false);
    setNewCategoryChecked(false);
    setNewItemChecked(false);
  }, [itemName, categoryName]);

  const handleClose = useCallback(({ detail: { action } }: DialogOnCloseEventT) => {
    if (action === 'accept') {
      tableData.addTransformer({
        categoryName: isCategoryChecked ? categoryName : undefined,
        itemName: isItemChecked ? itemName : undefined,
        itemNameRegExp: isItemRegExpChecked ? new RegExp(itemNameRegExp) : undefined,
        newCategoryName: isNewCategoryChecked && categoryName !== newCategoryName
          ? newCategoryName
          : undefined,
        newItemName: isNewItemChecked && itemNameRegExp !== newItemName
          ? newItemName
          : undefined,
      });
    }
    categoryDialogState.hide();
  }, [
    isCategoryChecked,
    isItemChecked,
    isItemRegExpChecked,
    categoryName,
    itemName,
    itemNameRegExp,
    newCategoryName,
    newItemName,
    isNewCategoryChecked,
    isNewItemChecked,
  ]);

  const isCategoryConditionDisabled = useMemo(() => {
    return tableData.forbiddenToTransformCategoryNames.includes(categoryName);
  }, [categoryName]);

  const isItemConditionDisabled = useMemo(() => {
    return tableData.forbiddenToTransformItemNames.includes(itemName);
  }, [itemName]);

  useEffect(() => {
    if (isItemRegExpChecked) {
      setItemChecked(false);
    }
  }, [isItemRegExpChecked]);

  useEffect(() => {
    if (isItemChecked) {
      setItemRegExpChecked(false);
    }
  }, [isItemChecked]);

  return (
    <Dialog
      open={isVisible}
      onClose={handleClose}
      className={styles.dialog}
    >
      <DialogContent>
        <h4>Условия</h4>
        <p>Выберите условия, при совпадении которых будут изменяться записи</p>
        <Checkbox
          id="categoryCheck"
          label={<span>Название категории <strong>{categoryName}</strong></span>}
          checked={isCategoryChecked}
          onValueChange={setCategoryChecked}
          disabled={isCategoryConditionDisabled}
        />
        <Checkbox
          id="itemCheck"
          label={<span>Название перевода <strong>{itemName}</strong></span>}
          checked={isItemChecked}
          onValueChange={setItemChecked}
          disabled={isItemConditionDisabled}
        />
        <FormField className={styles.field}>
          <span className={styles.fieldLabel}>
            <Checkbox
              id="itemRegExpCheck"
              label={<span>Название перевода (RegExp)</span>}
              checked={isItemRegExpChecked}
              onValueChange={setItemRegExpChecked}
              disabled={isItemConditionDisabled}
            />
          </span>
          <TextField
            value={itemNameRegExp}
            onValueChange={setItemNameRegExp}
            fullwidth
            disabled={!isItemRegExpChecked}
          />
        </FormField>

        <h4>Трансформации</h4>
        <p>Выберите трансформации, которые будут применяться к записям</p>
        <FormField className={styles.field}>
          <span className={styles.fieldLabel}>
            <Checkbox
              id="newCategoryCheck"
              checked={isNewCategoryChecked}
              onValueChange={setNewCategoryChecked}
              label="Категория"
            />
          </span>
          <TextField
            value={newCategoryName}
            onValueChange={setNewCategoryName}
            fullwidth
            disabled={!isNewCategoryChecked}
          />
        </FormField>
        <FormField className={styles.field}>
          <span className={styles.fieldLabel}>
            <Checkbox
              id="newItemCheck"
              checked={isNewItemChecked}
              onValueChange={setNewItemChecked}
              label="Название перевода"
            />
          </span>
          <TextField
            value={newItemName}
            onValueChange={setNewItemName}
            fullwidth
            disabled={!isNewItemChecked}
          />
        </FormField>
      </DialogContent>

      <DialogActions>
        <DialogButton action="close">
          Отмена
        </DialogButton>
        <DialogButton
          action="accept"
          isDefaultAction
          disabled={!isCategoryChecked && !isItemChecked && !isItemRegExpChecked}
        >
          Применить
        </DialogButton>
      </DialogActions>
    </Dialog>

  );
});

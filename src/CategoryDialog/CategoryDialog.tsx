import {
  useCallback, useEffect, useMemo, useState, VFC,
} from 'react';
import { observer } from 'mobx-react-lite';
import {
  Dialog, DialogActions, DialogContent, DialogButton,
} from '@rmwc/dialog';
import { FormField } from '@rmwc/formfield';
import { toast } from 'react-toastify';

import { tableData } from 'store';
import { TextField } from 'components/TextField';
import { Checkbox } from 'components/Checkbox';
import { categoryDialogState } from './categoryDialogState';

import '@rmwc/formfield/styles';
import '@material/dialog/dist/mdc.dialog.css';
import '@material/button/dist/mdc.button.css';
import '@material/ripple/dist/mdc.ripple.css';

import styles from './CategoryDialog.module.scss';

const escapeRegExp = (text: string) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#]/g, '\\$&');
};

// TODO Возможность сбрасывать текстовые поля
export const CategoryDialog: VFC<{}> = observer(() => {
  const {
    transformer, isVisible,
  } = categoryDialogState;

  const [isCategoryChecked, setCategoryChecked] = useState(false);
  const [isItemChecked, setItemChecked] = useState(false);
  const [isItemRegExpChecked, setItemRegExpChecked] = useState(false);
  const [isNewCategoryChecked, setNewCategoryChecked] = useState(false);
  const [isNewItemChecked, setNewItemChecked] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState(transformer.categoryName || '');
  const [itemNameRegExp, setItemNameRegExp] = useState(transformer.itemName || '');
  const [newItemName, setNewItemName] = useState(transformer.itemName || '');

  useEffect(() => {
    // Если редактируем трансформацию, подставляем её поля
    if (transformer.id) {
      setCategoryChecked(Boolean(transformer.categoryName));
      setItemChecked(Boolean(transformer.itemName));
      setItemRegExpChecked(Boolean(transformer.itemNameRegExp));
      setNewCategoryChecked(Boolean(transformer.newCategoryName));
      setNewItemChecked(Boolean(transformer.newItemName));
      setNewCategoryName(transformer.newCategoryName || transformer.categoryName || '');
      setNewItemName(transformer.newItemName || transformer.itemName || '');
      setItemNameRegExp(transformer.itemNameRegExp
        ? transformer.itemNameRegExp.toString().slice(1, -1)
        : escapeRegExp(transformer.itemName || ''));
    } else {
      setNewCategoryName(transformer.categoryName || '');
      setNewItemName(transformer.itemName || '');
      setItemNameRegExp(escapeRegExp(transformer.itemName || ''));
      setCategoryChecked(false);
      setItemChecked(false);
      setItemRegExpChecked(false);
      setNewCategoryChecked(false);
      setNewItemChecked(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transformer]);

  const handleClose = useCallback(() => {
    categoryDialogState.hide();
  }, []);
  const handleAcceptClick = useCallback(() => {
    setTimeout(() => {
      try {
        if (transformer.id) {
          tableData.deleteTransformer(transformer.id);
        }
        tableData.addTransformer({
          categoryName: isCategoryChecked ? transformer.categoryName : undefined,
          itemName: isItemChecked ? transformer.itemName : undefined,
          itemNameRegExp: isItemRegExpChecked ? new RegExp(itemNameRegExp) : undefined,
          newCategoryName: isNewCategoryChecked && transformer.categoryName !== newCategoryName
            ? newCategoryName
            : undefined,
          newItemName: isNewItemChecked && transformer.itemName !== newItemName
            ? newItemName
            : undefined,
        });
        toast.success('Успешно');
      } catch (err) {
        categoryDialogState.reopen();
        toast.error((err as Error).message);
      }
    }, 0);
    categoryDialogState.hide();
  }, [
    isCategoryChecked,
    isItemChecked,
    isItemRegExpChecked,
    itemNameRegExp,
    transformer,
    newCategoryName,
    newItemName,
    isNewCategoryChecked,
    isNewItemChecked,
  ]);

  const isCategoryConditionDisabled = useMemo(() => {
    return tableData.forbiddenToTransformCategoryNames.includes(transformer.categoryName);
  }, [transformer.categoryName]);

  const isItemConditionDisabled = useMemo(() => {
    return tableData.forbiddenToTransformItemNames.includes(transformer.itemName);
  }, [transformer.itemName]);

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
          label={<span>Название категории <strong>{transformer.categoryName}</strong></span>}
          checked={isCategoryChecked}
          onValueChange={setCategoryChecked}
          disabled={isCategoryConditionDisabled}
        />
        <Checkbox
          id="itemCheck"
          label={<span>Название перевода <strong>{transformer.itemName}</strong></span>}
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
          isDefaultAction
          onClick={handleAcceptClick}
          disabled={!isCategoryChecked && !isItemChecked && !isItemRegExpChecked}
        >
          Применить
        </DialogButton>
      </DialogActions>
    </Dialog>

  );
});

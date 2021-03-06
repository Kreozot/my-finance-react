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
import { Autocomplete } from 'components/Autocomplete';
import { confirmationDialogState } from 'components/ConfirmationDialog';
import { CategoryType } from 'types';
import { transformerEditDialogState } from './transformerEditDialogState';

import styles from './TransformerEditDialog.module.scss';

const DELETE_CONFIRMATION_MESSAGE = 'Удалить трансформацию? Это не приведёт к удалению транзакций, к которым она была применена. Они просто начнут отображаться в исходном виде.';

const escapeRegExp = (text: string) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#]/g, '\\$&');
};

// TODO Возможность сбрасывать текстовые поля
export const TransformerEditDialog: VFC<{}> = observer(() => {
  const {
    transformer, isVisible,
  } = transformerEditDialogState;

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
      setNewCategoryName('');
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
    transformerEditDialogState.hide();
  }, []);
  const handleAcceptClick = useCallback(() => {
    setTimeout(() => {
      try {
        if (transformer.id) {
          tableData.deleteTransformer(transformer.id);
        }
        tableData.addTransformer({
          categoryType: transformer.categoryType,
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
        transformerEditDialogState.reopen();
        toast.error((err as Error).message);
      }
    }, 0);
    transformerEditDialogState.hide();
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

  const canBeApplied = useMemo(() => {
    return (isCategoryChecked || isItemChecked || isItemRegExpChecked)
      && ((isNewCategoryChecked && newCategoryName) || (isNewItemChecked && newItemName));
  }, [
    isCategoryChecked,
    isItemChecked,
    isItemRegExpChecked,
    newCategoryName,
    newItemName,
    isNewCategoryChecked,
    isNewItemChecked,
  ]);

  const handleDeleteClick = useCallback(() => {
    confirmationDialogState.confirm(DELETE_CONFIRMATION_MESSAGE, () => {
      if (transformer.id) {
        transformerEditDialogState.hide();
        tableData.deleteTransformer(transformer.id);
      }
    });
  }, [transformer.id]);

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
          label={<span>Category name <strong>{transformer.categoryName}</strong></span>}
          checked={isCategoryChecked}
          onValueChange={setCategoryChecked}
          disabled={isCategoryConditionDisabled}
        />
        <Checkbox
          id="itemCheck"
          label={<span>Transaction name <strong>{transformer.itemName}</strong></span>}
          checked={isItemChecked}
          onValueChange={setItemChecked}
          disabled={isItemConditionDisabled}
        />
        <FormField className={styles.field}>
          <span className={styles.fieldLabel}>
            <Checkbox
              id="itemRegExpCheck"
              label={<span>Transaction name (RegExp)</span>}
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

        <h4>Transformations</h4>
        <p>Choose transformations to apply to the records</p>
        <FormField className={styles.field}>
          <span className={styles.fieldLabel}>
            <Checkbox
              id="newCategoryCheck"
              checked={isNewCategoryChecked}
              onValueChange={setNewCategoryChecked}
              label="Category"
            />
          </span>
          <Autocomplete
            value={newCategoryName}
            onValueChange={setNewCategoryName}
            fullwidth
            disabled={!isNewCategoryChecked}
            items={transformer.categoryType === CategoryType.Income
              ? tableData.incomeCategories
              : tableData.expenseCategories}
          />
        </FormField>
        <FormField className={styles.field}>
          <span className={styles.fieldLabel}>
            <Checkbox
              id="newItemCheck"
              checked={isNewItemChecked}
              onValueChange={setNewItemChecked}
              label="Transaction name"
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
        {/* FIXME Разобраться почему не стилизуется danger */}
        {
          Boolean(transformer.id)
            && (
              <DialogButton
                danger
                onClick={handleDeleteClick}
              >
                Удалить
              </DialogButton>
            )
        }
        <DialogButton action="close">
          Cancel
        </DialogButton>
        <DialogButton
          isDefaultAction
          onClick={handleAcceptClick}
          disabled={!canBeApplied}
        >
          Apply
        </DialogButton>
      </DialogActions>
    </Dialog>

  );
});
TransformerEditDialog.displayName = 'TransformerEditDialog';

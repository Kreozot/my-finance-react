import { useCallback, useState, VFC } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Dialog, DialogTitle, DialogActions, DialogContent, DialogButton,
} from '@rmwc/dialog';
import { TextField } from '@rmwc/textfield';
import { FormField } from '@rmwc/formfield';
import { Checkbox } from '@rmwc/checkbox';
import { categoryDialogState } from './categoryDialogState';

import '@rmwc/textfield/styles';
import '@rmwc/formfield/styles';
import '@rmwc/checkbox/styles';
import '@material/dialog/dist/mdc.dialog.css';
import '@material/button/dist/mdc.button.css';
import '@material/ripple/dist/mdc.ripple.css';

import styles from './CategoryDialog.module.scss';

type CategoryDialogProps = {

};

export const CategoryDialog: VFC<CategoryDialogProps> = observer(() => {
  const {
    categoryName, itemName, isVisible,
  } = categoryDialogState;

  const [isCategoryChecked, setCategoryChecked] = useState(false);
  const [isItemChecked, setItemChecked] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState(categoryName);
  const [newItemName, setNewItemName] = useState(itemName);

  const handleClose = useCallback(({ detail: { action } }) => {
    if (action === 'accept') {
      console.log('ok');
    }
    categoryDialogState.hide();
  }, []);

  const handleCategoryCheck = useCallback(({ event: { currentTarget: { checked } } }) => {
    setCategoryChecked(checked);
  }, []);

  const handleItemCheck = useCallback(({ event: { currentTarget: { checked } } }) => {
    setItemChecked(checked);
  }, []);

  return (
    <Dialog
      open={isVisible}
      onClose={handleClose}
      onClosed={(evt) => console.log(evt.detail.action)}
    >
      <DialogContent>
        <h4>Условия</h4>
        <Checkbox
          label={<span>Название категории <strong>{categoryName}</strong></span>}
          checked={isCategoryChecked}
          onChange={handleCategoryCheck}
        />
        <Checkbox
          label={<span>Название перевода <strong>{itemName}</strong></span>}
          checked={isItemChecked}
          onChange={handleItemCheck}
        />

        <h4>Трансформации</h4>
        <FormField>
          <span className={styles.fieldLabel}>Категория</span>
          <TextField
            id="categoryName"
            value={newCategoryName}
          />
        </FormField>
        <FormField>
          <span className={styles.fieldLabel}>Название перевода</span>
          <TextField
            id="categoryName"
            value={newItemName}
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

import { VFC, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Dialog, DialogActions, DialogContent, DialogButton, DialogOnCloseEventT,
} from '@rmwc/dialog';

import { confirmationDialogState } from './confirmationDialogState';

import styles from './ConfirmationDialog.module.scss';

export const ConfirmationDialog: VFC<{}> = observer(() => {
  const { message, isVisible, onConfirm } = confirmationDialogState;

  const handleClose = useCallback((event: DialogOnCloseEventT) => {
    if (event.detail.action === 'agree') {
      onConfirm();
    }
    confirmationDialogState.isVisible = false;
  }, [onConfirm]);

  return (
    <Dialog
      open={isVisible}
      onClose={handleClose}
    >
      <DialogContent>
        {message}
      </DialogContent>
      <DialogActions>
        <DialogButton action="close">
          Отмена
        </DialogButton>
        <DialogButton
          action="agree"
          isDefaultAction
        >
          Да
        </DialogButton>
      </DialogActions>
    </Dialog>
  );
});

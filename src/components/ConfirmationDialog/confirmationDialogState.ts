import { makeAutoObservable } from 'mobx';

class ConfirmationDialogState {
  isVisible: boolean = false;

  message: string = '';

  onConfirm: () => void = () => {};

  constructor() {
    makeAutoObservable(this);
  }

  confirm(message: string, onConfirm: () => void) {
    this.message = message;
    this.onConfirm = onConfirm;
    this.isVisible = true;
  }
}

export const confirmationDialogState = new ConfirmationDialogState();

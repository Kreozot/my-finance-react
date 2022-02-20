import { makeAutoObservable } from 'mobx';

class CategoryDialogState {
  isVisible: boolean = false;

  categoryName: string = '';

  itemName: string = '';

  constructor() {
    makeAutoObservable(this);
  }

  show(categoryName?: string, itemName?: string) {
    if (categoryName) {
      this.categoryName = categoryName;
    }
    if (itemName) {
      this.itemName = itemName;
    }
    this.isVisible = true;
  }

  hide() {
    this.isVisible = false;
  }
}

export const categoryDialogState = new CategoryDialogState();

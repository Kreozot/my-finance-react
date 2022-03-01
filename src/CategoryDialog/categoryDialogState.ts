import { makeAutoObservable } from 'mobx';
import { tableData, Transformer } from 'store';
import { CategoryType } from 'types';

class CategoryDialogState {
  isVisible: boolean = false;

  transformer: Transformer = {};

  constructor() {
    makeAutoObservable(this);
  }

  add(categoryName: string, itemName: string, categoryType: CategoryType) {
    const transformer: Transformer = {};
    transformer.categoryName = categoryName;
    transformer.itemName = itemName;
    transformer.categoryType = categoryType;
    console.log(categoryType);
    this.transformer = transformer;
    this.isVisible = true;
  }

  reopen() {
    this.isVisible = true;
  }

  edit(transformerId: string) {
    const transformer = tableData.transformers.find(({ id }) => id === transformerId);
    if (transformer) {
      this.transformer = transformer;
    }
    this.isVisible = true;
  }

  hide() {
    this.isVisible = false;
  }
}

export const categoryDialogState = new CategoryDialogState();

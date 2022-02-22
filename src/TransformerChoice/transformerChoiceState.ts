import { makeAutoObservable } from 'mobx';

class TransformerChoiceState {
  isVisible: boolean = false;

  transformerIds: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  show(transformerIds: string[]) {
    this.transformerIds = transformerIds;
    this.isVisible = true;
  }

  hide() {
    this.isVisible = false;
  }
}

export const transformerChoiceState = new TransformerChoiceState();

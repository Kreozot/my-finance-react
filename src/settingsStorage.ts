export enum Setting {
  HiddenCategoriesFilter = 'hiddenCategoriesFilter',
  HiddenCategories = 'hiddenCategories',
  Transformers = 'transformers',
}

const replacer = (key: string, value: any): any => {
  if (key === 'itemNameRegExp') {
    return value.toString();
  }
  return value;
};

const reviver = (key: string, value: any): any => {
  if (key === 'itemNameRegExp') {
    return new RegExp(value.slice(1, -1));
  }
  return value;
};

export const loadSetting = (settingName: Setting): any => {
  return JSON.parse(localStorage.getItem(settingName) || 'null', reviver);
};

export const saveSetting = (settingName: Setting, value: any) => {
  localStorage.setItem(settingName, JSON.stringify(value, replacer));
};

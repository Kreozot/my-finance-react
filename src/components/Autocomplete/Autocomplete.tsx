import { TextField, TextFieldProps } from 'components/TextField';
import { useCombobox } from 'downshift';
import { VFC, memo, useState } from 'react';
import { ReactComponent as ArrowIcon } from '@material-design-icons/svg/filled/arrow_drop_down.svg';

import classNames from 'classnames';
import { IconButton } from 'components/IconButton';
import styles from './Autocomplete.module.scss';

type AutocompleteProps = TextFieldProps & {
  items: string[];
};

export const Autocomplete: VFC<AutocompleteProps> = memo(({ items, ...restProps }) => {
  const [inputItems, setInputItems] = useState(items);

  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: inputItems,
    onInputValueChange: ({ inputValue }) => {
      setInputItems(
        items.filter((item) => item.toLowerCase().startsWith((inputValue || '').toLowerCase())),
      );
    },
  });

  return (
    <div className={styles.combo} {...getComboboxProps()}>
      <TextField {...restProps} {...getInputProps()} className={styles.input} />
      <IconButton
        {...getToggleButtonProps()}
        Icon={ArrowIcon}
        className={styles.button}
      />
      {isOpen
            && (
              <div {...getMenuProps()} className={styles.menu}>
                {inputItems.map((item, index) => (
                  <div
                    className={classNames(styles.item, {
                      [styles.highlighted]: highlightedIndex === index,
                    })}
                    key={item}
                    {...getItemProps({ item, index })}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
    </div>
  );
});

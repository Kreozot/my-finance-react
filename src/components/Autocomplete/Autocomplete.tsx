import { TextField, TextFieldProps } from 'components/TextField';
import { useCombobox } from 'downshift';
import { VFC, memo, useState } from 'react';
import { ReactComponent as ArrowIcon } from '@material-design-icons/svg/filled/arrow_drop_down.svg';

import classNames from 'classnames';
import { IconButton } from 'components/IconButton';
import styles from './Autocomplete.module.scss';

type AutocompleteProps = TextFieldProps & {
  items: string[];
  fullwidth: boolean;
  disabled: boolean;
};

export const Autocomplete: VFC<AutocompleteProps> = memo((props) => {
  const {
    items, fullwidth, disabled, onValueChange, ...restProps
  } = props;
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
    selectedItem: restProps.value,
    onInputValueChange: ({ inputValue }) => {
      setInputItems(
        items.filter((item) => item.toLowerCase().startsWith((inputValue || '').toLowerCase())),
      );
      onValueChange(inputValue || '');
    },
  });

  return (
    <div
      className={classNames(styles.combo, {
        [styles.fullWidth]: fullwidth,
      })}
      {...getComboboxProps()}
    >
      <TextField
        {...restProps}
        {...getInputProps()}
        className={styles.input}
        fullwidth={fullwidth}
        disabled={disabled}
      />
      <IconButton
        {...getToggleButtonProps()}
        Icon={ArrowIcon}
        className={styles.button}
        disabled={disabled}
      />
      {/* Из-за особенностей downshift, меню должно рендериться всегда */}
      <div
        {...getMenuProps()}
        className={classNames(styles.menu, {
          [styles.open]: isOpen,
        })}
      >
        {
          isOpen
          && (inputItems.map((item, index) => (
            <div
              {...getItemProps({ item, index })}
              className={classNames(styles.item, {
                [styles.highlighted]: highlightedIndex === index,
              })}
              key={item}
            >
              {item}
            </div>
          )))
        }
      </div>
    </div>
  );
});
Autocomplete.displayName = 'Autocomplete';

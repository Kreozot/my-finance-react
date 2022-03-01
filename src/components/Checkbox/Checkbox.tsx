import { VFC, memo, useCallback } from 'react';
import { Checkbox as RMWCCheckbox, CheckboxProps as RMWCCheckboxProps } from '@rmwc/checkbox';

import '@rmwc/checkbox/styles';
import './Checkbox.module.scss';

type CheckboxProps = Omit<RMWCCheckboxProps, 'onChange'> & {
  onValueChange: (value: boolean) => void,
};

export const Checkbox: VFC<CheckboxProps> = memo((props) => {
  const { onValueChange, ...rest } = props;

  const handleChange = useCallback(({ target: { checked } }) => {
    onValueChange(checked);
  }, [onValueChange]);

  return (
    <RMWCCheckbox {...rest} onChange={handleChange} />
  );
});
Checkbox.displayName = 'Checkbox';

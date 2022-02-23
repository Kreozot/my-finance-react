import {
  memo, useCallback, forwardRef,
} from 'react';
import { TextField as RMWCTextField, TextFieldProps as RMWCTextFieldProps } from '@rmwc/textfield';

import '@rmwc/textfield/styles';

export type TextFieldProps = Omit<RMWCTextFieldProps, 'onChange'> & {
  onValueChange: (value: string) => void,
};

export const TextField = memo(forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => {
  const { onValueChange, ...rest } = props;

  const handleChange = useCallback(({ target: { value } }) => {
    onValueChange(value);
  }, [onValueChange]);

  return (
    <RMWCTextField inputRef={ref} onChange={handleChange} {...rest} />
  );
}));

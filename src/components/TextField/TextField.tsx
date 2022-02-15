import { VFC, memo, useCallback } from 'react';
import { TextField as RMWCTextField, TextFieldProps as RMWCTextFieldProps } from '@rmwc/textfield';

import '@rmwc/textfield/styles';

type TextFieldProps = Omit<RMWCTextFieldProps, 'onChange'> & {
  onValueChange: (value: string) => void,
};

export const TextField: VFC<TextFieldProps> = memo((props) => {
  const { onValueChange, ...rest } = props;

  const handleChange = useCallback(({ target: { value } }) => {
    onValueChange(value);
  }, [onValueChange]);

  return (
    <RMWCTextField {...rest} onChange={handleChange} />
  );
});

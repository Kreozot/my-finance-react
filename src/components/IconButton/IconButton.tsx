import {
  forwardRef,
  FunctionComponent, memo, SVGProps,
} from 'react';

import styles from './IconButton.module.scss';

export type IconButtonProps = {
  className?: string;
  Icon: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string | undefined; }>;
  title: string
  onClick: () => void;
  disabled?: boolean;
};

export const IconButton = memo(forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => {
  const {
    className = '', Icon, title, onClick, disabled = false,
  } = props;

  return (
    <button
      type="button"
      title={title}
      className={`${styles.iconButton} ${className}`}
      onClick={onClick}
      disabled={disabled}
      ref={ref}
    >
      <Icon
        className={styles.icon}
      />
    </button>
  );
}));
IconButton.displayName = 'IconButton';

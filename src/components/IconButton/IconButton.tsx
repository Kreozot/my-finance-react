import {
  FunctionComponent, memo, SVGProps, VFC,
} from 'react';

import styles from './IconButton.module.scss';

type IconButtonProps = {
  className?: string;
  Icon: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string | undefined; }>;
  title: string
  onClick: () => void;
};

export const IconButton: VFC<IconButtonProps> = memo((props) => {
  const {
    className = '', Icon, title, onClick,
  } = props;

  return (
    <button
      type="button"
      title={title}
      className={`${styles.iconButton} ${className}`}
      onClick={onClick}
    >
      <Icon
        className={styles.icon}
        // icon={{ icon, size: 'small' }}
      />
    </button>
  );
});

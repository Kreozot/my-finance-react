import { memo, VFC } from 'react';
import { Icon } from '@rmwc/icon';

import styles from './IconButton.module.scss';

type IconButtonProps = {
  className: string;
  icon: string;
  title: string
  onClick: () => void;
};

const IconButtom: VFC<IconButtonProps> = (props) => {
  const {
    className, icon, title, onClick,
  } = props;
  return (
    <button
      type="button"
      title={title}
      className={`${styles.iconButton} ${className}`}
      onClick={onClick}
    >
      <Icon
        className={styles.visibilityButton}
        icon={{ icon, size: 'small' }}
      />
    </button>
  );
};

export default memo(IconButtom);

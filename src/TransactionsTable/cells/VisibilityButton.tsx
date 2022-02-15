import { observer } from 'mobx-react-lite';
import {
  useCallback, useMemo, VFC,
} from 'react';

import { ReactComponent as VisibilityIcon } from '@material-design-icons/svg/filled/visibility.svg';
import { ReactComponent as VisibilityOffIcon } from '@material-design-icons/svg/filled/visibility_off.svg';

import { IconButton } from 'components/IconButton';
import { tableData } from 'store';

import styles from './CategoryCell.module.scss';

type VisibilityButtonProps = {
  categoryName: string;
};

export const VisibilityButton: VFC<VisibilityButtonProps> = observer((props) => {
  const { categoryName } = props;

  const isHidden = tableData.isCategoryHidden(categoryName);

  const title = useMemo(() => {
    return isHidden
      ? 'Показать категорию'
      : 'Скрыть категорию';
  }, [isHidden]);

  const icon = useMemo(() => {
    return isHidden
      ? VisibilityOffIcon
      : VisibilityIcon;
  }, [isHidden]);

  const toggleFilter = useCallback(() => {
    if (isHidden) {
      tableData.showCategory(categoryName);
    } else {
      tableData.hideCategory(categoryName);
    }
  }, [categoryName, isHidden]);

  return (
    <IconButton
      title={title}
      onClick={toggleFilter}
      Icon={icon}
      className={styles.visibilityButton}
    />
  );
});
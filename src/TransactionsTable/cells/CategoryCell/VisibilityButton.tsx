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
  categoryCode: string;
};

export const VisibilityButton: VFC<VisibilityButtonProps> = observer((props) => {
  const { categoryCode } = props;

  const isHidden = tableData.isCategoryHidden(categoryCode);

  const title = useMemo(() => {
    return isHidden
      ? 'Show category'
      : 'Hide category';
  }, [isHidden]);

  const icon = useMemo(() => {
    return isHidden
      ? VisibilityOffIcon
      : VisibilityIcon;
  }, [isHidden]);

  const toggleFilter = useCallback(() => {
    if (isHidden) {
      tableData.showCategory(categoryCode);
    } else {
      tableData.hideCategory(categoryCode);
    }
  }, [categoryCode, isHidden]);

  return (
    <IconButton
      title={title}
      onClick={toggleFilter}
      Icon={icon}
      className={styles.visibilityButton}
    />
  );
});
VisibilityButton.displayName = 'VisibilityButton';

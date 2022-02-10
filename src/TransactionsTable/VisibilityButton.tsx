import { observer } from 'mobx-react-lite';
import {
  useCallback, useMemo, VFC,
} from 'react';
import { IconButton } from '../components/IconButton';
import { tableData } from '../store';

type VisibilityButtonProps = {
  category: string;
};

export const VisibilityButton: VFC<VisibilityButtonProps> = observer((props) => {
  const { category } = props;

  const isHidden = tableData.isCategoryHidden(category);

  const title = useMemo(() => {
    return isHidden
      ? 'Показать категорию'
      : 'Скрыть категорию';
  }, [isHidden]);

  const icon = useMemo(() => {
    return isHidden
      ? 'visibility_off'
      : 'visibility';
  }, [isHidden]);

  const toggleFilter = useCallback(() => {
    if (isHidden) {
      tableData.showCategory(category);
    } else {
      tableData.hideCategory(category);
    }
  }, [category, isHidden]);

  return (
    <span>
      <IconButton
        title={title}
        onClick={toggleFilter}
        icon={icon}
      />
    </span>
  );
});

import { memo, useMemo, VFC } from 'react';
import { IconButton } from '../components/IconButton';

type ToolbarCellProps = {
  showHiddenCategories: () => void;
  areHiddenCategoriesShown: boolean;
};

export const ToolbarCell: VFC<ToolbarCellProps> = memo((props) => {
  const { showHiddenCategories, areHiddenCategoriesShown } = props;

  const title = useMemo(() => {
    return areHiddenCategoriesShown
      ? 'Не показывать скрытые категории'
      : 'Показать скрытые категории';
  }, [areHiddenCategoriesShown]);

  const icon = useMemo(() => {
    return areHiddenCategoriesShown
      ? 'visibility'
      : 'visibility_off';
  }, [areHiddenCategoriesShown]);

  return (
    <span>
      <IconButton
        title={title}
        onClick={showHiddenCategories}
        icon={icon}
      />
    </span>
  );
});

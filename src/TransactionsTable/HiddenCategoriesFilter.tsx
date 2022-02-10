import {
  memo, useCallback, useMemo, VFC,
} from 'react';
import { IconButton } from '../components/IconButton';
import { FixedFilterProps } from './data-table';

export const HiddenCategoriesFilter: VFC<FixedFilterProps> = memo(({ column }) => {
  const { setFilter, filterValue } = column;

  const title = useMemo(() => {
    return filterValue
      ? 'Показать скрытые категории'
      : 'Не показывать скрытые категории';
  }, [filterValue]);

  const icon = useMemo(() => {
    return filterValue
      ? 'visibility_off'
      : 'visibility';
  }, [filterValue]);

  const toggleFilter = useCallback(() => setFilter(!filterValue), [filterValue, setFilter]);

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

import {
  memo, useCallback, useMemo, VFC,
} from 'react';

import { ReactComponent as VisibilityIcon } from '@material-design-icons/svg/filled/visibility.svg';
import { ReactComponent as VisibilityOffIcon } from '@material-design-icons/svg/filled/visibility_off.svg';

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
      ? VisibilityOffIcon
      : VisibilityIcon;
  }, [filterValue]);

  const toggleFilter = useCallback(() => setFilter(!filterValue), [filterValue, setFilter]);

  return (
    <IconButton
      title={title}
      onClick={toggleFilter}
      Icon={icon}
    />
  );
});

import {
  memo, useCallback, useMemo, VFC,
} from 'react';

import { ReactComponent as FilterIcon } from '@material-design-icons/svg/filled/filter_alt.svg';
import { ReactComponent as FilterOffIcon } from '@material-design-icons/svg/filled/filter_alt_off.svg';

import { IconButton } from 'components/IconButton';
import { FixedFilterProps } from '../data-table';

export const DateFilter: VFC<FixedFilterProps> = memo(({ column }) => {
  const { setFilter, filterValue } = column;

  const title = useMemo(() => {
    return filterValue
      ? 'Отключить фильтр по месяцу'
      : 'Фильтровать по этому месяцу';
  }, [filterValue]);

  const icon = useMemo(() => {
    return filterValue
      ? FilterOffIcon
      : FilterIcon;
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
DateFilter.displayName = 'DateFilter';

import {
  memo, useCallback, useMemo, VFC,
} from 'react';

import { ReactComponent as FilterIcon } from '@material-design-icons/svg/filled/search.svg';
import { ReactComponent as VisibilityIcon } from '@material-design-icons/svg/filled/visibility.svg';
import { ReactComponent as VisibilityOffIcon } from '@material-design-icons/svg/filled/visibility_off.svg';

import { IconButton } from 'components/IconButton';
import { TextField } from 'components/TextField';
import { saveSetting, Setting } from 'settingsStorage';
import { FixedFilterProps } from '../../data-table';

import styles from './CategoryFilter.module.scss';

export type CategoryFilterValue = {
  hiddenColumns?: boolean;
  text?: string;
};

export const CategoryFilter: VFC<FixedFilterProps> = memo(({ column }) => {
  const { setFilter, filterValue }: {
    setFilter: (updater: CategoryFilterValue) => void,
    filterValue: CategoryFilterValue,
  } = column;

  const iconTitle = useMemo(() => {
    return filterValue.hiddenColumns
      ? 'Show hidden categories'
      : 'Don\'t show hidden categories';
  }, [filterValue]);

  const icon = useMemo(() => {
    return filterValue.hiddenColumns
      ? VisibilityOffIcon
      : VisibilityIcon;
  }, [filterValue]);

  const toggleFilter = useCallback(() => {
    const newFilterValue: CategoryFilterValue = {
      ...filterValue,
      hiddenColumns: !filterValue.hiddenColumns,
    };
    setFilter(newFilterValue);
    saveSetting(Setting.HiddenCategoriesFilter, newFilterValue.hiddenColumns);
  }, [filterValue, setFilter]);

  // TODO useDebounce
  const handleTextChange = useCallback((text: string) => {
    const newFilterValue: CategoryFilterValue = {
      ...filterValue,
      text,
    };
    setFilter(newFilterValue);
  }, [filterValue, setFilter]);

  return (
    <div className={styles.container}>
      <TextField
        onValueChange={handleTextChange}
        outlined
        icon={<FilterIcon className={styles.filterIcon} />}
      />
      <IconButton
        title={iconTitle}
        onClick={toggleFilter}
        Icon={icon}
      />
    </div>
  );
});
CategoryFilter.displayName = 'CategoryFilter';

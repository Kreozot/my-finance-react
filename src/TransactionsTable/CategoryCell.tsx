import { VFC } from 'react';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';

import { FixedCellProps } from './data-table';
import { RowData, tableData } from '../store';

import styles from './CategoryCell.module.scss';
import { VisibilityButton } from './VisibilityButton';

export const CategoryCell: VFC<FixedCellProps> = observer(({ row, cell }) => {
  if (row.original) {
    const isHidden = tableData.isCategoryHidden((row.original as RowData).category);
    const className = classNames(styles.name, { [styles.hidden]: isHidden });
    return (
      <span className={className}>
        {row.original.name}
      </span>
    );
  }

  const categoryTitle = row.values.category.slice(0, -2);
  const isHidden = tableData.isCategoryHidden(cell.value);
  const className = classNames(styles.categoryName, {
    [styles.income]: row.values.category.slice(-1) === '1',
    [styles.hidden]: isHidden,
  });

  return (
    <span className={styles.category}>
      <span
        className={className}
        {...row.getToggleRowExpandedProps()}
      >
        {categoryTitle}
      </span>

      <VisibilityButton category={cell.value} />
    </span>
  );
});

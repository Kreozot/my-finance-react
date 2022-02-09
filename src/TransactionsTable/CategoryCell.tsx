import { memo, VFC } from 'react';

import { IconButton } from '../components/IconButton';
import { FixedCellProps } from './data-table';
import { tableData } from '../store';

import styles from './CategoryCell.module.scss';

export const CategoryCell: VFC<FixedCellProps> = memo(({ row, cell }) => {
  if (row.original) {
    return (
      <span className={styles.name}>
        {row.original.name}
      </span>
    );
  }
  const categoryTitle = row.values.category.slice(0, -2);
  const incomeClassName = row.values.category.slice(-1) === '1' ? styles.income : styles.expenses;

  return (
    <span className={styles.category}>
      <span
        className={`${styles.categoryName} ${incomeClassName}`}
        {...row.getToggleRowExpandedProps()}
      >
        {categoryTitle}
      </span>

      <IconButton
        className={styles.visibilityButton}
        title="Скрыть категорию"
        icon="visibility_off"
        onClick={() => tableData.hideCategory(cell.value)}
      />
    </span>
  );
});

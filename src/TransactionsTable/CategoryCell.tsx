import { memo, VFC } from 'react';
import { Icon } from '@rmwc/icon';

import { FixedCellProps } from './data-table';
import { tableData } from '../data-transform';

import styles from './CategoryCell.module.scss';

const CategoryCell: VFC<FixedCellProps> = ({ row, cell }) => {
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
    <span>
      <span
        className={`${styles.category} ${incomeClassName}`}
        {...row.getToggleRowExpandedProps()}
      >
        {categoryTitle}
      </span>

      <Icon
        icon={{ icon: 'visibility', size: 'small' }}
        onClick={() => tableData.hideCategory(cell.value)}
      />
    </span>
  );
};

export default memo(CategoryCell);

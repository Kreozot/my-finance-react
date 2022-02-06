import { memo, VFC } from 'react';
import { CellProps } from 'react-table';

import { RowData } from '../data-transform';

import styles from './CategoryCell.module.scss';

const CategoryCell: VFC<CellProps<RowData>> = ({ row }) => {
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
    <span className={`${styles.category} ${incomeClassName}`}>
      {categoryTitle}
    </span>
  );
};

export default memo(CategoryCell);

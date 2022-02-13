import { VFC } from 'react';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';

import { tableData } from 'store';
import { FixedCellProps } from '../data-table';
import { isIncomeRow, isSummaryRow } from '../tableUtils';
import { VisibilityButton } from './VisibilityButton';

import styles from './CategoryCell.module.scss';

export const CategoryCell: VFC<FixedCellProps> = observer(({ row, cell }) => {
  if (row.original) {
    const isHidden = tableData.isCategoryHidden(row.original.category);
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
    [styles.income]: isIncomeRow(row),
    [styles.hidden]: isHidden,
  });

  return (
    <span className={styles.category}>
      <span
        className={className}
        {...(!isSummaryRow(row) ? row.getToggleRowExpandedProps() : {})}
      >
        {categoryTitle}
      </span>

      {!isSummaryRow(row) && <VisibilityButton category={cell.value} />}
    </span>
  );
});

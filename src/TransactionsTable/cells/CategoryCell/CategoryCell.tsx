import { VFC } from 'react';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';

import { tableData } from 'store';
import { decodeCategory } from 'convertData';
import { FixedCellProps } from '../../data-table';
import { isIncomeRow, isSummaryRow } from '../../tableUtils';
import { VisibilityButton } from './VisibilityButton';

import styles from './CategoryCell.module.scss';
import { Item } from './Item';

export const CategoryCell: VFC<FixedCellProps> = observer(({ row, cell }) => {
  if (row.original) {
    const {
      categoryCode, categoryType, categoryName, itemName, banks, transformerIds,
    } = row.original;
    const isHidden = tableData.isCategoryHidden(categoryCode);

    return (
      <Item
        categoryName={categoryName}
        categoryType={categoryType}
        itemName={itemName}
        banksString={banks.join(';')}
        isHidden={isHidden}
        transformersString={(transformerIds || []).join(';')}
      />
    );
  }

  const { categoryName } = decodeCategory(row.values.categoryCode);
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
        {categoryName}
      </span>

      {!isSummaryRow(row) && <VisibilityButton categoryCode={cell.value} />}
    </span>
  );
});
CategoryCell.displayName = 'CategoryCell';

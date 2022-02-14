import { VFC } from 'react';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';

import { tableData } from 'store';
import { IconButton } from 'components/IconButton';
import { categoryDialogState } from 'CategoryDialog/categoryDialogState';
import { ReactComponent as EditIcon } from '@material-design-icons/svg/filled/edit.svg';
import { FixedCellProps } from '../data-table';
import { isIncomeRow, isSummaryRow } from '../tableUtils';
import { VisibilityButton } from './VisibilityButton';

import styles from './CategoryCell.module.scss';

export const CategoryCell: VFC<FixedCellProps> = observer(({ row, cell }) => {
  if (row.original) {
    const { categoryName, itemName } = row.original;
    const isHidden = tableData.isCategoryHidden(categoryName);
    const className = classNames(styles.name, { [styles.hidden]: isHidden });

    return (
      <span>
        <span className={className}>
          {itemName}
        </span>
        {/* <IconButton
          title="Редактировать информацию"
          Icon={EditIcon}
          onClick={() => {
            categoryDialogState.show(categoryName, itemName);
          }}
        /> */}
      </span>
    );
  }

  const categoryTitle = row.values.categoryName.slice(0, -2);
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

      {!isSummaryRow(row) && <VisibilityButton categoryName={cell.value} />}
    </span>
  );
});

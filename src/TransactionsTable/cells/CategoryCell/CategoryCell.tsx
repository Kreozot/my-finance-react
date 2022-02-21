import { VFC } from 'react';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';

import { tableData } from 'store';
import { IconButton } from 'components/IconButton';
import { categoryDialogState } from 'CategoryDialog/categoryDialogState';
import { ReactComponent as EditIcon } from '@material-design-icons/svg/filled/edit.svg';
import { decodeCategory } from 'convertData';
import { FixedCellProps } from '../../data-table';
import { isIncomeRow, isSummaryRow } from '../../tableUtils';
import { VisibilityButton } from './VisibilityButton';

import styles from './CategoryCell.module.scss';
import { BankIcon } from './BankIcon';

export const CategoryCell: VFC<FixedCellProps> = observer(({ row, cell }) => {
  if (row.original) {
    const {
      categoryCode, categoryName, itemName, banks,
    } = row.original;
    const isHidden = tableData.isCategoryHidden(categoryCode);
    const className = classNames(styles.name, { [styles.hidden]: isHidden });

    return (
      <span className={styles.nameCell}>
        <span className={styles.banks}>
          {banks.map((bank) => <BankIcon bank={bank} key={bank} />)}
        </span>
        <span className={className}>
          {itemName}
        </span>
        <IconButton
          title="Редактировать информацию"
          Icon={EditIcon}
          className={styles.editButton}
          onClick={() => {
            categoryDialogState.show(categoryName, itemName);
          }}
        />
      </span>
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

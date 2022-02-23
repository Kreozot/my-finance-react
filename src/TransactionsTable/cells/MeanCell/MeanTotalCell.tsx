import { memo, VFC } from 'react';
import { isNonAbsoluteRow } from 'TransactionsTable/tableUtils';

import { FixedCellProps, FixedRow } from '../../data-table';
import { getMoneyDataFromRow, Mean } from './Mean';

export const MeanTotalCell: VFC<FixedCellProps> = memo(({ row }) => {
  const data = getMoneyDataFromRow(row as FixedRow, false, true, true);

  return (
    <Mean data={data} isNonAbsolute={isNonAbsoluteRow(row)} />
  );
});

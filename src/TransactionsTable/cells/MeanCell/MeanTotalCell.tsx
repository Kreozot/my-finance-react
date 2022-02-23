import { memo, VFC } from 'react';

import { FixedCellProps, FixedRow } from '../../data-table';
import { getMoneyDataFromRow, MeanCell } from './Mean';

export const MeanTotalCell: VFC<FixedCellProps> = memo(({ row }) => {
  const data = getMoneyDataFromRow(row as FixedRow, false, true, true);

  return (
    <MeanCell data={data} />
  );
});

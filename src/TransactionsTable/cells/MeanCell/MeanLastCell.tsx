import { memo, VFC } from 'react';

import { FixedCellProps, FixedRow } from '../../data-table';
import { getMoneyDataFromRow, MeanCell } from './Mean';

export const MeanLastCell: VFC<FixedCellProps> = memo(({ row }) => {
  const data = getMoneyDataFromRow(row as FixedRow, true, true, false);

  return (
    <MeanCell data={data} />
  );
});

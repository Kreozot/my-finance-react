import { memo, VFC } from 'react';

import { isNonAbsoluteRow } from '../../tableUtils';
import { FixedCellProps } from '../../data-table';

import { Money } from './Money';

export const MoneyCell: VFC<Partial<FixedCellProps>> = memo(({ value, row }) => {
  return (
    <Money value={isNonAbsoluteRow(row) ? value : Math.abs(value)} />
  );
});
MoneyCell.displayName = 'MoneyCell';

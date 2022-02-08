import {
  TableState,
  UseGroupByState,
  UseExpandedState,
  Cell,
  UseExpandedRowProps,
  Row,
  UseGroupByCellProps,
} from 'react-table';

export type FixedTableState = TableState<RowData> & UseGroupByState<RowData> & UseExpandedState<RowData>;
export type FixedCell = Cell<RowData, any> & UseGroupByCellProps<RowData>;
export type FixedRow = (Row<RowData> & UseExpandedRowProps<RowData>) & {
  cells: FixedCell[];
};
export type FixedCellProps = CellProps<RowData> & {
  cell: FixedCell;
  row: FixedRow;
};

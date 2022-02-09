import {
  TableState,
  UseGroupByState,
  UseExpandedState,
  Cell,
  UseExpandedRowProps,
  Row,
  UseGroupByCellProps,
  HeaderGroup,
  UseFiltersColumnProps,
  ColumnInstance,
  UseTableHeaderGroupProps,
  FilterProps,
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
export type FixedColumnProps = ColumnInstance<RowData> & UseFiltersColumnProps<RowData>;
export type FixedFilterProps = FilterProps<RowData> & {
  column: FixedColumnProps,
};
export type FixedHeaderGroup = UseTableHeaderGroupProps<RowData> & FixedColumnProps & {
  headers: Array<FixedHeaderGroup>;
};

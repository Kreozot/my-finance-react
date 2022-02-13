import {
  TableState,
  UseGroupByState,
  UseExpandedState,
  Cell,
  UseExpandedRowProps,
  Row,
  UseGroupByCellProps,
  UseFiltersColumnProps,
  ColumnInstance,
  UseTableHeaderGroupProps,
  FilterProps,
  CellProps,
  TableInstance,
  Column,
} from 'react-table';

export type FixedColumn = Column<RowData>;
export type FixedTableState = TableState<RowData> & UseGroupByState<RowData> & UseExpandedState<RowData>;
export type FixedCell = Omit<Cell<RowData, any>, 'column'> & UseGroupByCellProps<RowData> & {
  column: FixedColumnProps;
};
export type FixedRow = Omit<Row<RowData>, 'cells' | 'original'> & UseExpandedRowProps<RowData> & {
  cells: FixedCell[];
  original: RowData;
};
export type FixedCellProps = Omit<CellProps<RowData>, 'cell' | 'row'> & {
  cell: FixedCell;
  row: FixedRow;
};
export type FixedColumnProps = ColumnInstance<RowData> & UseFiltersColumnProps<RowData>;
export type FixedFilterProps = Omit<FilterProps<RowData>, 'column'> & {
  column: FixedColumnProps,
};
export type FixedHeaderGroup = Omit<UseTableHeaderGroupProps<RowData>, 'headers'> & FixedColumnProps & {
  headers: Array<FixedHeaderGroup>;
};
export type FixedTableInstance = Omit<TableInstance<RowData>, 'rows' | 'headerGroups'> & {
  state: FixedTableState,
  rows: FixedRow[],
  headerGroups: FixedHeaderGroup[],
};

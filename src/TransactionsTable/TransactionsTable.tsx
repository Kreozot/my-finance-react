import { VFC, memo, useMemo } from 'react';
import MiniChart from 'react-mini-chart';
import {
  Column,
  useExpanded,
  useGroupBy,
  useTable,
  TableState,
  UseGroupByState,
  TableInstance,
  UseExpandedState,
  Cell,
  UseExpandedRowProps,
  Row,
  UseGroupByCellProps,
} from 'react-table';
import {
  DataTable,
  DataTableCell,
  DataTableHeadCell,
  DataTableRow,
  DataTableBody,
  DataTableContent,
  DataTableHead,
} from '@rmwc/data-table';

import { dates, data, RowData } from '../data-transform';
import { formatDateKeyHeader } from '../dates';
import { formatMoney } from '../money';

import '@material/data-table/dist/mdc.data-table.css';
import '@rmwc/data-table/data-table.css';
import '@rmwc/icon/icon.css';

import styles from './TransactionsTable.module.scss';

type TransactionsTableProps = {

};

type FixedTableState = TableState<RowData> & UseGroupByState<RowData> & UseExpandedState<RowData>;
type FixedCell = Cell<RowData, any> & UseGroupByCellProps<RowData>;
type FixedRow = (Row<RowData> & UseExpandedRowProps<RowData>) & {
  cells: FixedCell[]
};

const DATA_COLUMN_START_INDEX = 2;

const TransactionsTable: VFC<TransactionsTableProps> = () => {
  const columns = useMemo(() => [
    {
      Header: 'Категория',
      accessor: 'category',
    },
    {
      Header: 'Название',
      accessor: 'name',
    },
    ...dates.map((dateKey) => ({
      Header: formatDateKeyHeader(dateKey),
      accessor: dateKey,
      aggregate: 'sum',
      Cell: ({ value }: { value:number }) => formatMoney(value),
    })),
    {
      Header: 'График',
    },
  ] as ReadonlyArray<Column<RowData>>, []);

  const {
    getTableProps,
    headerGroups,
    rows,
    prepareRow,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- TODO
    state: { groupBy, expanded },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        groupBy: ['category'],
      } as FixedTableState,
    },
    useGroupBy,
    useExpanded,
  ) as (TableInstance<RowData> & {
    state: FixedTableState,
    rows: FixedRow[],
  });

  // Render the UI for your table
  return (
    <DataTable
      {...getTableProps()}
      stickyRows={1}
      stickyColumns={2}
    >
      <DataTableContent>
        <DataTableHead>
          {headerGroups.map((headerGroup) => (
            <DataTableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <DataTableHeadCell {...column.getHeaderProps()}>
                  {column.render('Header')}
                </DataTableHeadCell>
              ))}
            </DataTableRow>
          ))}
        </DataTableHead>
        <DataTableBody>
          {rows.map((row: FixedRow) => {
            prepareRow(row);
            const chartDataSet = dates.map((dateKey: string) => Math.abs(row?.values?.[dateKey]));

            return (
              <DataTableRow {...row.getRowProps()}>
                {row.cells.map((cell: FixedCell, index) => {
                  if (cell.isGrouped) {
                    return (
                      <DataTableCell
                        {...cell.getCellProps()}
                        {...row.getToggleRowExpandedProps()}
                      >
                        {cell.render('Cell')}
                      </DataTableCell>
                    );
                  }

                  return (
                    <DataTableCell
                      {...cell.getCellProps()}
                      alignEnd={index >= DATA_COLUMN_START_INDEX}
                    >
                      {cell.render('Cell')}
                    </DataTableCell>
                  );
                })}
                <DataTableCell>
                  <MiniChart dataSet={chartDataSet} />
                </DataTableCell>
              </DataTableRow>
            );
          })}
        </DataTableBody>
      </DataTableContent>
    </DataTable>
  );
};

export default memo(TransactionsTable);

import { VFC, memo, useMemo } from 'react';
import {
  Column,
  useExpanded,
  useGroupBy,
  useTable,
  TableInstance,
  CellProps,
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
import { formatMoney, median } from '../money';

import '@material/data-table/dist/mdc.data-table.css';
import '@rmwc/data-table/data-table.css';
import '@rmwc/icon/icon.css';

import ChartCell from './ChartCell';
import { FixedRow, FixedTableState, FixedCell } from './data-table';

// import styles from './TransactionsTable.module.scss';

type TransactionsTableProps = {

};

const DATA_COLUMN_START_INDEX = 2;

const getMoneyDataFromRow = (row: FixedRow, trimStart: boolean = false) => {
  let firstOccurrence = false;
  const result = Object.keys(row.values)
    .filter((key) => /\d\d\d\d-\d\d/.test(key))
    .map((key) => row.values[key]);
  if (trimStart) {
    return result
      .filter((value) => {
        if (firstOccurrence) {
          return true;
        }
        if (value) {
          firstOccurrence = true;
          return true;
        }
        return false;
      });
  }
  return result;
};

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
    {
      Header: 'График',
      id: 'chart',
      Cell: ChartCell,
    },
    {
      Header: 'Медиана',
      id: 'median',
      Cell: ({ row }: CellProps<RowData>) => formatMoney(median(getMoneyDataFromRow(row as FixedRow, true))),
    },
    ...dates.map((dateKey) => ({
      Header: formatDateKeyHeader(dateKey),
      id: dateKey,
      accessor: (originalRow: RowData) => originalRow.transactions[dateKey],
      aggregate: 'sum',
      Cell: ({ value }: CellProps<RowData>) => formatMoney(value),
    })),
  ] as ReadonlyArray<Column<RowData>>, []);

  const {
    getTableProps,
    headerGroups,
    rows,
    prepareRow,
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
              </DataTableRow>
            );
          })}
        </DataTableBody>
      </DataTableContent>
    </DataTable>
  );
};

export default memo(TransactionsTable);

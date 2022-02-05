import { VFC, memo, useMemo } from 'react';
import { Column, useExpanded, useGroupBy, useTable, TableState, UseGroupByState, TableInstance, UseExpandedState } from 'react-table';
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

import '@material/data-table/dist/mdc.data-table.css'
import '@rmwc/data-table/data-table.css'
import '@rmwc/icon/icon.css'
import { formatDateKeyHeader } from '../dates';
import { formatMoney } from '../money';

type TransactionsTableProps = {

};

type FixedTableState = TableState<RowData> & UseGroupByState<RowData> & UseExpandedState<RowData>;

const TransactionsTable: VFC<TransactionsTableProps> = () => {
  const columns = useMemo(() => [
    {
      Header: 'Категория',
      accessor: 'category'
    },
    {
      Header: 'Название',
      accessor: 'name',
    },
    ...dates.map((dateKey) => ({
      Header: formatDateKeyHeader(dateKey),
      accessor: dateKey,
      aggregate: 'sum',
      Cell: ({ value }: {value:number}) => formatMoney(value),
    })),
  ] as ReadonlyArray<Column<RowData>>, []);

  const {
    getTableProps,
    headerGroups,
    rows,
    prepareRow,
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
    state: FixedTableState
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
        {headerGroups.map(headerGroup => (
          <DataTableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <DataTableHeadCell {...column.getHeaderProps()}>
                {column.render('Header')}
              </DataTableHeadCell>
            ))}
          </DataTableRow>
        ))}
      </DataTableHead>
      <DataTableBody>
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <DataTableRow {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <DataTableCell {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </DataTableCell>
                  )
                })}
              </DataTableRow>
            )
          })}
      </DataTableBody>
      </DataTableContent>
    </DataTable>
  )
};

export default memo(TransactionsTable);

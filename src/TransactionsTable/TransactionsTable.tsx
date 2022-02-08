import { VFC, memo, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Column,
  useExpanded,
  useGroupBy,
  useTable,
  TableInstance,
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
import { Icon } from '@rmwc/icon';

import { dates, tableData, RowData } from '../data-transform';
import { formatDateKeyHeader } from '../dates';

import '@material/data-table/dist/mdc.data-table.css';
import 'material-design-icons/iconfont/material-icons.css';
import '@rmwc/data-table/data-table.css';
import '@rmwc/icon/icon.css';

import ChartCell from './ChartCell';
import { FixedRow, FixedTableState, FixedCell } from './data-table';
import MeanCell from './MeanCell';
import CategoryCell from './CategoryCell';

import styles from './TransactionsTable.module.scss';
import MoneyCell from './MoneyCell';

type TransactionsTableProps = {

};

const DATA_COLUMN_START_INDEX = 2;

const TransactionsTable: VFC<TransactionsTableProps> = () => {
  const columns = useMemo(() => [
    {
      Header: 'Категория',
      accessor: 'category',
      Cell: CategoryCell,
    },
    {
      Header: 'График',
      id: 'chart',
      Cell: ChartCell,
    },
    {
      Header: <>Ср. для P<sub>95%</sub> за год</>,
      id: 'median',
      Cell: MeanCell,
    },
    ...dates.map((dateKey) => ({
      Header: formatDateKeyHeader(dateKey),
      id: dateKey,
      accessor: (originalRow: RowData) => originalRow.transactions[dateKey],
      aggregate: 'sum',
      Cell: MoneyCell,
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
      data: tableData.data,
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
                <DataTableHeadCell {...column.getHeaderProps()} className={styles.header}>
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
                        <Icon
                          icon={{ icon: 'visibility', size: 'small' }}
                          onClick={() => tableData.hideCategory(cell.value)}
                        />
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

export default observer(TransactionsTable);

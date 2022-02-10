import {
  VFC, useMemo, useCallback,
} from 'react';
import { observer } from 'mobx-react-lite';
import {
  Column,
  useExpanded,
  useGroupBy,
  useTable,
  useFilters,
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

import { dates, tableData, RowData } from '../store';
import { formatDateKeyHeader } from '../dates';
import { ChartCell } from './ChartCell';
import {
  FixedRow, FixedTableState, FixedTableInstance,
} from './data-table';
import { MeanCell } from './MeanCell';
import { CategoryCell } from './CategoryCell';
import { MoneyCell } from './MoneyCell';

import '@material/data-table/dist/mdc.data-table.css';
import 'material-design-icons/iconfont/material-icons.css';
import '@rmwc/data-table/data-table.css';
import '@rmwc/icon/icon.css';

import styles from './TransactionsTable.module.scss';
import { HiddenCategoriesFilter } from './HiddenCategoriesFilter';
import { DateFilter } from './DateFilter';

type TransactionsTableProps = {

};

export const TransactionsTable: VFC<TransactionsTableProps> = observer(() => {
  const categoryFilter = useCallback((rows: FixedRow[], id: string, filterValue: boolean) => {
    return rows.filter((row) => {
      const categoryName = row.values[id];
      return !filterValue || !tableData.isCategoryHidden(categoryName);
    });
  }, []);

  const dateFilter = useCallback((rows: FixedRow[], id: string, filterValue: boolean) => {
    return rows.filter((row) => {
      const value = row.values[id];
      return !filterValue || Boolean(value);
    });
  }, []);

  const columns = useMemo(() => [
    {
      Header: 'Категория',
      accessor: 'category',
      Cell: CategoryCell,
      Filter: HiddenCategoriesFilter,
      filter: categoryFilter,
    },
    {
      Header: 'График',
      id: 'chart',
      Cell: ChartCell,
      disableFilters: true,
    },
    {
      Header: <>Ср. для P<sub>95%</sub> за год</>,
      id: 'median',
      Cell: MeanCell,
      disableFilters: true,
    },
    ...dates.map((dateKey) => ({
      Header: formatDateKeyHeader(dateKey),
      id: dateKey,
      accessor: (originalRow: RowData) => originalRow.transactions[dateKey],
      aggregate: 'sum',
      // disableFilters: true,
      Filter: DateFilter,
      filter: dateFilter,
      Cell: MoneyCell,
    })),
  ] as ReadonlyArray<Column<RowData>>, [categoryFilter, dateFilter]);

  const {
    getTableProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data: tableData.tableRows,
      initialState: {
        groupBy: ['category'],
      } as FixedTableState,
    },
    useFilters,
    useGroupBy,
    useExpanded,
  ) as FixedTableInstance;

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
                  <span className={styles.headerCell}>
                    <span className={styles.headerTitle}>
                      {column.render('Header')}
                    </span>
                    {column.canFilter ? column.render('Filter') : null}
                  </span>
                </DataTableHeadCell>
              ))}
            </DataTableRow>
          ))}
        </DataTableHead>
        <DataTableBody>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <DataTableRow {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <DataTableCell
                      {...cell.getCellProps()}
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
});

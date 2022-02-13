import {
  VFC, useMemo, useCallback,
} from 'react';
import { observer } from 'mobx-react-lite';
import {
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
import classNames from 'classnames';

import {
  dates, tableData, firstMonthKeys,
} from 'store';
import { formatDateKeyHeader } from 'dates';
import {
  ChartCell, MeanCell, CategoryCell, MoneyCell,
} from './cells';
import { DateFilter, HiddenCategoriesFilter } from './filters';
import {
  FixedRow, FixedTableState, FixedTableInstance, FixedColumn,
} from './data-table';

import '@material/data-table/dist/mdc.data-table.css';
import '@rmwc/data-table/data-table.css';
import '@rmwc/icon/icon.css';

import styles from './TransactionsTable.module.scss';
import { isSummaryRow } from './tableUtils';
import { RowData } from '../types';

type TransactionsTableProps = {

};

export const TransactionsTable: VFC<TransactionsTableProps> = observer(() => {
  const categoryFilter = useCallback((rows: FixedRow[], id: string, filterValue: boolean) => {
    return rows.filter((row) => {
      const categoryName = row.values[id];
      return !filterValue || isSummaryRow(row) || !tableData.isCategoryHidden(categoryName);
    });
  }, []);

  const dateFilter = useCallback((rows: FixedRow[], id: string, filterValue: boolean) => {
    return rows.filter((row) => {
      const value = row.values[id];
      return !filterValue || isSummaryRow(row) || Boolean(value);
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
      Header: 'Среднее за год',
      id: 'median',
      Cell: MeanCell,
      disableFilters: true,
    },
    ...dates.map((dateKey) => ({
      Header: formatDateKeyHeader(dateKey),
      id: dateKey,
      accessor: (originalRow: RowData) => originalRow.transactions[dateKey],
      aggregate: 'sum',
      Filter: DateFilter,
      filter: dateFilter,
      Cell: MoneyCell,
    })),
  ] as ReadonlyArray<FixedColumn>, [categoryFilter, dateFilter]);

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
                <DataTableHeadCell
                  {...column.getHeaderProps()}
                  className={classNames({
                    [styles.firstMonthCell]: firstMonthKeys.includes(column.id),
                  })}
                >
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
                      className={classNames({
                        [styles.highlightedCell]: isSummaryRow(row) || cell.column.filterValue,
                        [styles.firstMonthCell]: firstMonthKeys.includes(cell.column.id),
                      })}
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

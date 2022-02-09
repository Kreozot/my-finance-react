import {
  VFC, useMemo, useCallback,
} from 'react';
import { observer } from 'mobx-react-lite';
import {
  Column,
  useExpanded,
  useGroupBy,
  useTable,
  TableInstance,
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
  FixedRow, FixedTableState, FixedCell, FixedHeaderGroup, FixedColumnProps,
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

type TransactionsTableProps = {

};

const TransactionsTable: VFC<TransactionsTableProps> = () => {
  const categoryFilter = useCallback((rows: FixedRow[], id: string, filterHidden: boolean) => {
    return rows.filter((row) => {
      const categoryName = row.values[id];
      return !filterHidden || !tableData.isCategoryHidden(categoryName);
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
      disableFilters: true,
      Cell: MoneyCell,
    })),
  ] as ReadonlyArray<Column<RowData>>, [categoryFilter]);

  const {
    getTableProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data: tableData.pureData,
      initialState: {
        groupBy: ['category'],
      } as FixedTableState,
    },
    useFilters,
    useGroupBy,
    useExpanded,
  ) as (TableInstance<RowData> & {
    state: FixedTableState,
    rows: FixedRow[],
    headerGroups: FixedHeaderGroup[],
  });

  return (
    <DataTable
      {...getTableProps()}
      stickyRows={1}
      stickyColumns={2}
    >
      <DataTableContent>
        <DataTableHead>
          {headerGroups.map((headerGroup: FixedHeaderGroup) => (
            <DataTableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: FixedColumnProps) => (
                <DataTableHeadCell {...column.getHeaderProps()} className={styles.header}>
                  {column.render('Header')}
                  {column.canFilter ? column.render('Filter') : null}
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
                {row.cells.map((cell: FixedCell) => {
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
};

export default observer(TransactionsTable);

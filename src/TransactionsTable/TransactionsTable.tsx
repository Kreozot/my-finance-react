import {
  VFC, useMemo, useCallback, useState, useEffect,
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
import { RowData } from 'types';
import { formatDateKeyHeader } from 'dates';
import { loadSetting, Setting } from 'settingsStorage';
import {
  ChartCell, MeanTotalCell, MeanLastCell, CategoryCell, MoneyCell,
} from './cells';
import { DateFilter, CategoryFilter, CategoryFilterValue } from './filters';
import {
  FixedRow, FixedTableInstance, FixedColumn, FixedTableOptions,
} from './data-table';
import { isSummaryRow } from './tableUtils';

import styles from './TransactionsTable.module.scss';

type TransactionsTableProps = {

};

export const TransactionsTable: VFC<TransactionsTableProps> = observer(() => {
  const [expandedState, setExpandedState] = useState({});

  const categoryFilter = useCallback((rows: FixedRow[], id: string, filterValue: CategoryFilterValue) => {
    return rows.filter((row) => {
      if (isSummaryRow(row)) {
        return true;
      }
      const categoryCode: string = row.values[id].toLowerCase();
      const itemName = row.original?.itemName.toLowerCase() || '';
      return (!filterValue.hiddenColumns || !tableData.isCategoryHidden(categoryCode))
        && (!filterValue.text
          || categoryCode.includes(filterValue.text.toLowerCase())
          || itemName.includes(filterValue.text.toLowerCase()));
    });
  }, []);

  const dateFilter = useCallback((rows: FixedRow[], id: string, filterValue: boolean) => {
    return rows.filter((row) => {
      if (isSummaryRow(row)) {
        return true;
      }
      const value = row.values[id];
      return !filterValue || Boolean(value);
    });
  }, []);

  const columns = useMemo(() => [
    {
      Header: '',
      accessor: 'categoryCode',
      Cell: CategoryCell,
      Filter: CategoryFilter,
      filter: categoryFilter,
    },
    {
      Header: 'Тип',
      accessor: 'categoryType',
      Cell: () => <span />,
      disableFilters: true,
    },
    {
      Header: 'Название категории',
      accessor: 'categoryName',
      Cell: () => <span />,
      disableFilters: true,
    },
    {
      Header: 'График',
      id: 'chart',
      Cell: ChartCell,
      disableFilters: true,
    },
    {
      Header: 'Среднее',
      id: 'meanTotal',
      Cell: MeanTotalCell,
      disableFilters: true,
    },
    {
      Header: 'Среднее за год',
      id: 'meanLast',
      Cell: MeanLastCell,
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
    state: { expanded },
  } = useTable(
    {
      columns,
      data: tableData.tableRows,
      initialState: {
        filters: [
          {
            id: 'categoryCode',
            value: loadSetting(Setting.HiddenCategoriesFilter) || {
              hiddenColumns: true,
            } as CategoryFilterValue,
          },
        ],
        groupBy: ['categoryCode'],
        expanded: expandedState,
        hiddenColumns: ['categoryName', 'categoryType'],
      },
    } as FixedTableOptions,
    useFilters,
    useGroupBy,
    useExpanded,
  ) as FixedTableInstance;

  useEffect(() => {
    setExpandedState(expanded || {});
  }, [expanded]);

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
                        [styles.highlightedCell]: isSummaryRow(row)
                          || (cell.column.filterValue && cell.column.id !== 'categoryCode'),
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
TransactionsTable.displayName = 'TransactionsTable';

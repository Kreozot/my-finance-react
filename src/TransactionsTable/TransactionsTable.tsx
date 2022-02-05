import { VFC, memo, useMemo } from 'react';
import { useTable, UseTableColumnOptions, UseTableRowProps } from 'react-table';
import { dates, data } from '../data-transform';

type TransactionsTableProps = {

};

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
      Header: dateKey,
      accessor: dateKey,
    })),
  ], []);

  const tableInstance = useTable({ columns, data });

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance

  return (
    // apply the table props
    <table {...getTableProps()}>
      <thead>
        {// Loop over the header rows
        headerGroups.map(headerGroup => (
          // Apply the header row props
          <tr {...headerGroup.getHeaderGroupProps()}>
            {// Loop over the headers in each row
            headerGroup.headers.map(column => (
              // Apply the header cell props
              <th {...column.getHeaderProps()}>
                {// Render the header
                column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      {/* Apply the table body props */}
      <tbody {...getTableBodyProps()}>
        {// Loop over the table rows
        rows.map(row => {
          // Prepare the row for display
          prepareRow(row)
          return (
            // Apply the row props
            <tr {...row.getRowProps()}>
              {// Loop over the rows cells
              row.cells.map(cell => {
                // Apply the cell props
                return (
                  <td {...cell.getCellProps()}>
                    {// Render the cell contents
                    cell.render('Cell')}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
};

export default memo(TransactionsTable);

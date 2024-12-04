import React, { useState } from 'react';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableSortLabel, TableCell } from '@mui/material';
import Paper from '@mui/material/Paper';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';
import { GenericTableProps } from '../types/GenericTableProps';
import GenericTableRow from './GenericTableRow';

function GenericTable<DataType extends Record<string, any>>({
  columns,
  data,
  onEdit,
  onDelete,
  onSelectRow,
  disableActionsColumn = false,
  disableSelectColumn = false,
  rowColor,
}: GenericTableProps<DataType>) {
  const [selectedRow, setSelectedRow] = useState<DataType | null>(null);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string | null>(null);

  const handleRowSelect = (row: DataType) => {
    setSelectedRow(row === selectedRow ? null : row);
    onSelectRow?.(row === selectedRow ? null : row);
  };

  const handleSort = (columnKey: string) => {
    const isAsc = orderBy === columnKey && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(columnKey);
  };

  const sortedData = React.useMemo(() => {
    if (!orderBy) return data;
    return [...data].sort((a, b) => {
      const aValue = (a as Record<string, any>)[orderBy];
      const bValue = (b as Record<string, any>)[orderBy];
      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, order, orderBy]);

  const VirtuosoTableComponents: TableComponents<DataType> = {
    Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
      <TableContainer component={Paper} {...props} ref={ref} />
    )),
    Table: (props) => (
      <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
    ),
    TableHead: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
      <TableHead {...props} ref={ref} />
    )),
    TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
      <TableBody {...props} ref={ref} />
    )),
    TableRow,
  };

  const fixedHeaderContent = () => (
    <TableRow>
      {!disableSelectColumn && (
        <TableCell style={{ width: 50 }}>Select</TableCell>
      )}
      {!disableActionsColumn && (
        <TableCell style={{ width: 80 }}>Actions</TableCell>
      )}
      {columns.map((column) => (
        <TableCell
          key={String(column.dataKey)}
          align={column.numeric ? 'right' : 'left'}
          style={{ width: column.width }}
        >
          <TableSortLabel
            active={orderBy === column.dataKey}
            direction={orderBy === column.dataKey ? order : 'asc'}
            onClick={() => handleSort(String(column.dataKey))}
          >
            {column.label}
          </TableSortLabel>
        </TableCell>
      ))}
    </TableRow>
  );

  return (
    <Paper style={{ height: 600, width: '100%' }}>
      <TableVirtuoso
        data={sortedData}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={(_index, row) => (
          <GenericTableRow
            row={row}
            columns={columns}
            isSelected={row === selectedRow}
            onSelect={() => handleRowSelect(row)}
            onEdit={onEdit ?? (() => { })}
            onDelete={onDelete?? (() => {})}
            disableActionsColumn={disableActionsColumn}
            disableSelectColumn={disableSelectColumn}
            rowColor={rowColor}
          />
        )}
      />
    </Paper>
  );
}

export default GenericTable;

import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';
import { GenericTableProps } from '../types/GenericTableProps';

function GenericTable<DataType>({ columns, data }: GenericTableProps<DataType>) {
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

  // Renderiza o cabeçalho fixo
  const fixedHeaderContent = () => (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={String(column.dataKey)}
          variant="head"
          align={column.numeric ? 'right' : 'left'}
          style={{ width: column.width }}
          sx={{ backgroundColor: 'background.paper' }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );

  // Renderiza o conteúdo das linhas
  const rowContent = (_index: number, row: DataType) => (
    <React.Fragment>
      {columns.map((column) => (
        <TableCell
          key={String(column.dataKey)}
          align={column.numeric ? 'right' : 'left'}
        >
          {row[column.dataKey] as React.ReactNode}
        </TableCell>
      ))}
    </React.Fragment>
  );

  return (
    <Paper style={{ height: 400, width: '100%' }}>
      <TableVirtuoso
        data={data}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
      />
    </Paper>
  );
}

export default GenericTable;

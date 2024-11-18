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
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import '../styles/GenericTable.css';

function GenericTable<DataType>({ columns, data, onEdit, onDelete }: GenericTableProps<DataType>) {
  
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
      <TableCell
        key="actions-header"
        variant="head"
        style={{ width: 80 }}
        sx={{ backgroundColor: 'background.paper' }}
      >
        Actions
      </TableCell>
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

  const rowContent = (_index: number, row: DataType) => (
    <React.Fragment>
      <TableCell key="actions-cell" style={{ width: 80 }}>
        <IconButton onClick={() => onEdit(row)} aria-label="edit">
          <EditIcon className='edit-icon'/>
        </IconButton>
        <IconButton onClick={() => onDelete(row)} aria-label="delete">
          <DeleteIcon className='delete-icon'/>
        </IconButton>
      </TableCell>
      {columns.map((column) => (
        <TableCell
          key={String(column.dataKey)}
          align={column.numeric ? 'right' : 'left'}
        >
          {String(row[column.dataKey])}
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

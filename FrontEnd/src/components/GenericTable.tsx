import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Paper from '@mui/material/Paper';
import { IconButton, Radio } from '@mui/material';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';
import { GenericTableProps } from '../types/GenericTableProps';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import '../styles/GenericTable.css';

function GenericTable<DataType>({ columns, data, onEdit, onDelete, onSelectRow }: GenericTableProps<DataType>) {
  // Estado para rastrear a linha selecionada
  const [selectedRow, setSelectedRow] = useState<DataType | null>(null);

  const handleRowSelect = (row: DataType) => {
    setSelectedRow(row === selectedRow ? null : row); // Seleciona ou deseleciona a linha
    onSelectRow?.(row === selectedRow ? null : row); // Notifica o pai
  };  

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
      <TableCell
        key="selection-header"
        variant="head"
        style={{ width: 50 }}
        sx={{ backgroundColor: 'background.paper' }}
      >
        Select
      </TableCell>
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
      <TableCell key="selection-cell" style={{ width: 50 }}>
        <Radio
          checked={row === selectedRow}
          onChange={() => handleRowSelect(row)}
          inputProps={{ 'aria-label': `select-row-${_index}` }}
        />
      </TableCell>
      <TableCell key="actions-cell" style={{ width: 80 }}>
        <IconButton onClick={() => onEdit(row)} aria-label="edit">
          <EditIcon className="edit-icon" />
        </IconButton>
        <IconButton onClick={() => onDelete(row)} aria-label="delete">
          <DeleteIcon className="delete-icon" />
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

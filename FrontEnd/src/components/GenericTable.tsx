import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import Paper from '@mui/material/Paper';
import { IconButton, Radio } from '@mui/material';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';
import { GenericTableProps } from '../types/GenericTableProps';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import '../styles/GenericTable.css';

function GenericTable<DataType>({ columns, data, onEdit, onDelete, onSelectRow }: GenericTableProps<DataType>) {
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

  const rowContent = (_index: number, row: DataType) => {
    const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  
    const toggleRow = (index: number) => {
      setExpandedRows((prev) => ({
        ...prev,
        [index]: !prev[index],
      }));
    };
  
    const formatDate = (date: Date) =>{
      return date.toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    }
  
    return (
      <React.Fragment>
        <TableCell key="selection-cell" style={{ width: 20 }}>
          <Radio
            checked={row === selectedRow}
            onChange={() => handleRowSelect(row)}
            inputProps={{ 'aria-label': `select-row-${_index}` }}
          />
        </TableCell>
        <TableCell key="actions-cell" style={{ width: 20 }}>
          <IconButton onClick={() => onEdit(row)} aria-label="edit">
            <EditIcon className="edit-icon" />
          </IconButton>
          <IconButton onClick={() => onDelete(row)} aria-label="delete">
            <DeleteIcon className="delete-icon" />
          </IconButton>
        </TableCell>
        {columns.map((column) => {
          const value = row[column.dataKey];
          const isArray = Array.isArray(value);
  
          return (
            <TableCell key={String(column.dataKey)} align={column.numeric ? 'right' : 'left'}>
              {isArray ? (
                <>
                  {/* Exibe o último elemento da lista */}
                  <div>
                    {Object.values(value[value.length - 1])
                      .map((field) => {
                        if (field instanceof Date) {
                          return formatDate(field);
                        }
                        return String(field);
                      })
                      .join(" ")}
                    <IconButton size="small" onClick={() => toggleRow(_index)}>
                      {expandedRows[_index] ? '▲' : '▼'}
                    </IconButton>
                  </div>
                  {/* Exibe o histórico completo caso esteja expandido */}
                  {expandedRows[_index] && (
                    <div style={{ marginTop: 8 }}>
                      {value.slice(0, -1).map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            fontSize: "0.9em",
                            color: "gray",
                            display: "flex",
                            gap: "8px",
                          }}
                        >
                          {Object.values(item)
                            .map((field) => {
                              if (field instanceof Date) {
                                return formatDate(field);
                              }
                              return String(field);
                            })
                            .join(" ")}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                String(value)
              )}
            </TableCell>
          );
        })}
      </React.Fragment>
    );
  };  

  return (
    <Paper style={{ height: 400, width: '100%' }}>
      <TableVirtuoso
        data={sortedData}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
      />
    </Paper>
  );
}

export default GenericTable;

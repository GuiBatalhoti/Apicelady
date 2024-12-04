import { useState } from 'react';
import { TableCell, IconButton, Radio } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { GenericTableRowProps } from '../types/GenericTableProps';
import "../styles/GenericTable.css"

const GenericTableRow = <DataType extends Record<string, unknown>,>({ row,
  columns,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  disableActionsColumn = false,
  disableSelectColumn = false,
  rowColor,
}: GenericTableRowProps<DataType>) => {

  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  const toggleRow = (index: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const backgroundColor = rowColor?.(row) || 'inherit';

  return (
    <>
      {!disableSelectColumn && (
        <TableCell style={{ width: 20, backgroundColor: backgroundColor }}>
          <Radio
            checked={isSelected}
            onChange={onSelect}
            inputProps={{ 'aria-label': 'select-row' }}
          />
        </TableCell>
      )}
      {!disableActionsColumn && (
        <TableCell style={{ width: 20, backgroundColor: backgroundColor  }}>
          <IconButton onClick={() => onEdit(row)} aria-label="edit">
            <EditIcon className="edit-icon" />
          </IconButton>
          <IconButton onClick={() => onDelete(row)} aria-label="delete">
            <DeleteIcon className="delete-icon"/>
          </IconButton>
        </TableCell>
      )}
      {columns.map((column) => {
        const value = row[column.dataKey];
        const isArray = Array.isArray(value);

        return (
          <TableCell key={String(column.dataKey)} align={column.numeric ? 'right' : 'left'} style={{backgroundColor: backgroundColor}}>
            {isArray ? (
              <>
                <div>
                    {value.length > 0 && Object.values(value[value.length - 1])
                    .map((field) => {
                      if (field instanceof Date) {
                      return formatDate(field);
                      }
                      return String(field);
                    })
                    .join(' ')}
                  <IconButton size="small" onClick={() => toggleRow(value.length)}>
                    {expandedRows[value.length] ? '▲' : '▼'}
                  </IconButton>
                </div>
                {expandedRows[value.length] && (
                  <>
                    {value.length > 1 && (
                    <div style={{ marginTop: 8 }}>
                      {value.slice(0, -1).map((item: Record<string, any>, idx: number) => (
                      <div
                        key={idx}
                        style={{
                        fontSize: '0.9em',
                        color: 'gray',
                        display: 'flex',
                        gap: '8px',
                        }}
                      >
                        {Object.values(item)
                        .map((field: any) => {
                          if (field instanceof Date) {
                          return formatDate(field);
                          }
                          return String(field);
                        })
                        .join(' ')}
                      </div>
                      ))}
                    </div>
                    )}
                  </>
                )}
              </>
            ) : (
              value instanceof Date ? formatDate(value) : String(value)
            )}
          </TableCell>
        );
      })}
    </>
  );
};

export default GenericTableRow;

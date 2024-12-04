export interface Column<DataType> {
    dataKey: keyof DataType;
    label: string;
    numeric?: boolean;
    width?: number;
}

export interface GenericTableProps<DataType> {
    columns: Array<{ dataKey: string; numeric?: boolean; label: string; width?: number }>;
    data: DataType[];
    onEdit?: (row: DataType) => void;
    onDelete?: (row: DataType) => void;
    onSelectRow?: (row: DataType | null) => void;
    disableActionsColumn?: boolean;
    disableSelectColumn?: boolean;
    rowColor?: (row: DataType) => string;
  }
  

export interface GenericTableRowProps<DataType> {
    row: DataType;
    columns: Column<DataType>[];
    isSelected: boolean;
    onSelect: () => void;
    onEdit: (data: DataType) => void;
    onDelete: (data: DataType) => void;
    disableActionsColumn?: boolean;
    disableSelectColumn?: boolean;
    rowColor?: (row: DataType) => string;
}
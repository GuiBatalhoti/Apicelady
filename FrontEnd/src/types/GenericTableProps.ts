export interface Column<DataType> {
    dataKey: keyof DataType;
    label: string;
    numeric?: boolean;
    width?: number;
}

export interface GenericTableProps<DataType> {
    columns: Column<DataType>[];
    data: DataType[];
    onEdit: (data: DataType) => void;
    onDelete: (data: DataType) => void;
    onSelectRow: (item: DataType | null) => void;
}

export interface GenericTableRowProps<DataType> {
    row: DataType;
    columns: Column<DataType>[];
    isSelected: boolean;
    onSelect: () => void;
    onEdit: (data: DataType) => void;
    onDelete: (data: DataType) => void;
}
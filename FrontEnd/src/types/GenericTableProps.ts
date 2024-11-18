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
}
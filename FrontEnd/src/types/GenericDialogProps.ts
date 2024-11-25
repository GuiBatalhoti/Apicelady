export interface Field {
  label: string;
  key: string;
  type: "text" | "number";
  defaultValue?: string;
}

export interface GenericDialogProps<T> {
  open: boolean;
  title: string;
  item: T | null;
  fields: Field[];
  onClose: () => void;
  onSave: (item: T) => void;
}
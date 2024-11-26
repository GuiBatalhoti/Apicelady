export interface Field {
  label: string;
  key: string;
  type: "text" | "number" | "email" | "fone" | "date" | "dropdown";
  defaultValue?: string;
  disabled: boolean;
  options?: { label: string; value: string | number }[]
}

export interface GenericDialogProps<T> {
  open: boolean;
  title: string;
  item: T | null;
  fields: Field[];
  onClose: () => void;
  onSave: (item: T) => void;
}
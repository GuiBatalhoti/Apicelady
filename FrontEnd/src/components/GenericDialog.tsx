import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import { GenericDialogProps } from "../types/GenericDialogProps";

function GenericDialog<T extends Record<string, any>>({
  open,
  title,
  item,
  fields,
  onClose,
  onSave,
}: GenericDialogProps<T>) {
  const [currentItem, setCurrentItem] = React.useState<T>(() =>
    item
      ? { ...item }
      : fields.reduce(
          (acc, field) => ({ ...acc, [field.key]: field.defaultValue || "" }),
          {} as T
        )
  );

  React.useEffect(() => {
    setCurrentItem(
      item
        ? { ...item }
        : fields.reduce(
            (acc, field) => ({ ...acc, [field.key]: field.defaultValue || "" }),
            {} as T
          )
    );
  }, [item, fields]);

  const handleChange = (key: string, value: any, type: "text" | "number") => {
    let newValue = value;

    if (type === "number") {
      newValue = value.replace(/[^0-9.-]/g, "");
      if (newValue === "") newValue = null;
    }

    setCurrentItem((prev) => ({
      ...prev,
      [key]: type === "number" ? (newValue === null ? null : parseFloat(newValue)) : newValue,
    }));
  };

  const handleSave = () => {
    console.log("currentItem", currentItem);
    if (currentItem) onSave(currentItem);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {fields.map((field) => (
          <TextField
            key={field.key}
            margin="dense"
            label={field.label}
            type={field.type === "number" ? "text" : "text"}
            value={currentItem?.[field.key]}
            onChange={(e) => handleChange(field.key, e.target.value, field.type)}
            fullWidth
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleSave} color="primary">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default GenericDialog;

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { Field, GenericDialogProps } from "../types/GenericDialogProps";

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

  const handleChange = (key: string, value: any, type: Field["type"]) => {
    let newValue = value;

    if (type === "number") {
      newValue = value.replace(/[^0-9.-]/g, ""); // Permitir apenas números, ponto e hífen
      if (newValue === "") newValue = null;
    } else if (type === "fone") {
      newValue = value.replace(/[^0-9]/g, ""); // Permitir apenas números
    }

    setCurrentItem((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  };

  const handleSave = () => {
    console.log("currentItem", currentItem);
    if (currentItem) onSave(currentItem);
  };

  const handleKeyDown = (event: React.KeyboardEvent, type: Field["type"]) => {
    if (type === "number") {
      const invalidKeys = ["e", "E", "+", " "]; // Bloquear entradas inválidas
      if (invalidKeys.includes(event.key)) {
        event.preventDefault();
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {fields.map((field) => {
          if (field.type === "dropdown") {
            return (
              <TextField
                key={field.key}
                margin="dense"
                label={field.label}
                select
                value={currentItem?.[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value, field.type)}
                fullWidth
                disabled={field.disabled}
              >
                {field.options?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            );
          }

          return (
            <TextField
              key={field.key}
              margin="dense"
              label={field.label}
              type={field.type === "date" ? "date" : field.type}
              value={currentItem?.[field.key]}
              onChange={(e) => handleChange(field.key, e.target.value, field.type)}
              fullWidth
              disabled={field.disabled}
              slotProps={{
                inputLabel: field.type === "date" ? { shrink: true } : undefined,
                input: {
                  ...(field.type === "number" && { inputMode: "numeric" }), // Indicar modo numérico para dispositivos móveis
                },
              }}
              onKeyDown={(e) => handleKeyDown(e, field.type)} // Restringir teclas inválidas
            />
          );
        })}
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

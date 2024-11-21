import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import { ConfirmDialogProps } from "../types/ConfirmDialogProps";

export default function ConfirmDialog({open, title = "Confirmação", message = "Tem certeza que deseja realizar esta ação?", onConfirm, onCancel,}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="secondary">
          Cancelar
        </Button>
        <Button onClick={onConfirm} color="primary">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

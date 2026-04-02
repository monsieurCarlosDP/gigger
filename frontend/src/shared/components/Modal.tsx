import CloseIcon from '@mui/icons-material/Close';
import {
  Backdrop,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  type DialogProps
} from '@mui/material';
import type { ReactNode } from 'react';

export interface ModalProps extends Omit<DialogProps, 'open' | 'title'> {
  open: boolean;
  onClose: () => void;
  title?: ReactNode | string;
  children: ReactNode;
  onConfirm?: () => void | Promise<void>;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  showActions?: boolean;
  fullWidth?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Modal genérico reutilizable para diferentes contenidos
 * @example
 * <Modal open={isOpen} onClose={handleClose} title="Crear Persona">
 *   <FormContent />
 * </Modal>
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isLoading = false,
  showActions = !!onConfirm,
  fullWidth = true,
  maxWidth = 'sm',
  ...props
}: ModalProps) {
  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 300 } }}
      {...props}
    >
      {title && (
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 1,
          }}
        >
          {title}
          <IconButton
            size="small"
            onClick={onClose}
            sx={{ ml: 'auto' }}
            aria-label="close"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
      )}
      <DialogContent dividers>{children}</DialogContent>
      {showActions && (
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={onClose} variant="outlined" disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            disabled={isLoading}
            loading={isLoading}
          >
            {confirmText}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}

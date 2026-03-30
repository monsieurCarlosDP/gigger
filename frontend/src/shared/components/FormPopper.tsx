import {
  Popper,
  Paper,
  Stack,
  TextField,
  Button,
  Typography,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import { useState } from 'react';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'password' | 'select' | 'textarea';
  required?: boolean;
  placeholder?: string;
  defaultValue?: string | number;
  options?: { label: string; value: string | number }[];
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
  helperText?: string;
  validate?: (value: string | number) => string | null;
}

export interface FormPopperProps {
  title?: string;
  fields: FormField[];
  triggerButton: React.ReactNode;
  onSubmit: (data: Record<string, any>) => void | Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  width?: number;
  placement?:
    | 'top-start'
    | 'top'
    | 'top-end'
    | 'right-start'
    | 'right'
    | 'right-end'
    | 'bottom-start'
    | 'bottom'
    | 'bottom-end'
    | 'left-start'
    | 'left'
    | 'left-end';
}

export function FormPopper({
  title,
  fields,
  triggerButton,
  onSubmit,
  onCancel,
  submitLabel = 'Enviar',
  cancelLabel = 'Cancelar',
  loading = false,
  width = 350,
  placement = 'bottom-start',
}: FormPopperProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    fields.forEach((field) => {
      initial[field.name] = field.defaultValue ?? '';
    });
    return initial;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const open = Boolean(anchorEl);

  const handleTriggerClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setErrors({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      const value = formData[field.name];

      if (field.required && !value) {
        newErrors[field.name] = `${field.label} es obligatorio`;
        return;
      }

      if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors[field.name] = 'Email inválido';
        }
      }

      if (field.type === 'number' && value) {
        if (isNaN(Number(value))) {
          newErrors[field.name] = 'Debe ser un número';
        }
      }

      if (field.validate) {
        const customError = field.validate(value);
        if (customError) {
          newErrors[field.name] = customError;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      handleClose();
      // Reset form after successful submission
      const initial: Record<string, any> = {};
      fields.forEach((field) => {
        initial[field.name] = field.defaultValue ?? '';
      });
      setFormData(initial);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    handleClose();
  };

  return (
    <>
      <div onClick={handleTriggerClick} style={{ display: 'inline-block' }}>
        {triggerButton}
      </div>

      <Popper open={open} anchorEl={anchorEl} placement={placement}>
        <Paper
          sx={{
            p: 2.5,
            mt: 1,
            boxShadow: 3,
            borderRadius: 2,
            width,
          }}
        >
          <Stack spacing={2}>
            {title && (
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {title}
              </Typography>
            )}

            {fields.map((field) => (
              <div key={field.name}>
                {field.type === 'select' ? (
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label={field.label}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    disabled={field.disabled || isSubmitting || loading}
                    error={!!errors[field.name]}
                    helperText={errors[field.name] || field.helperText}
                    required={field.required}
                  >
                    {field.options?.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                ) : (
                  <TextField
                    fullWidth
                    size="small"
                    label={field.label}
                    name={field.name}
                    type={field.type}
                    value={formData[field.name]}
                    onChange={handleChange}
                    disabled={field.disabled || isSubmitting || loading}
                    placeholder={field.placeholder}
                    error={!!errors[field.name]}
                    helperText={errors[field.name] || field.helperText}
                    required={field.required}
                    multiline={field.multiline || field.type === 'textarea'}
                    rows={field.rows}
                  />
                )}
              </div>
            ))}

            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button
                size="small"
                onClick={handleCancel}
                disabled={isSubmitting || loading}
              >
                {cancelLabel}
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={handleSubmit}
                disabled={isSubmitting || loading}
                sx={{ position: 'relative' }}
              >
                {isSubmitting || loading ? (
                  <CircularProgress size={20} sx={{ position: 'absolute' }} />
                ) : null}
                {isSubmitting || loading ? '' : submitLabel}
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Popper>
    </>
  );
}

import { Alert, Snackbar } from '@mui/material';
import type { AlertColor } from '@mui/material';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

interface SnackbarOptions {
  message: string;
  severity: AlertColor;
  duration?: number;
}

interface SnackbarContextValue {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
  showWarning: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<SnackbarOptions | null>(null);
  const [open, setOpen] = useState(false);

  const show = useCallback((opts: SnackbarOptions) => {
    setOptions(opts);
    setOpen(true);
  }, []);

  const value = useMemo<SnackbarContextValue>(() => ({
    showSuccess: (message) => show({ message, severity: 'success' }),
    showError: (message) => show({ message, severity: 'error', duration: 6000 }),
    showInfo: (message) => show({ message, severity: 'info' }),
    showWarning: (message) => show({ message, severity: 'warning' }),
  }), [show]);

  return (
    <SnackbarContext value={value}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={options?.duration ?? 4000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={options?.severity ?? 'info'}
          onClose={() => setOpen(false)}
          variant="filled"
          sx={{ width: '100%', borderRadius: 3 }}
        >
          {options?.message}
        </Alert>
      </Snackbar>
    </SnackbarContext>
  );
}

export function useSnackbar(): SnackbarContextValue {
  const ctx = useContext(SnackbarContext);
  if (!ctx) throw new Error('useSnackbar must be used within SnackbarProvider');
  return ctx;
}

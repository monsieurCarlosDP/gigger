import { useMutation } from '@tanstack/react-query';
import { api } from '@/shared/api/client';
import { useSnackbar } from '@/shared/context/SnackbarContext';

interface SendEmailParams {
  email: string;
  subject: string;
  html: string;
  attachments?: {
    filename: string;
    content: string;
    contentType: string;
  }[];
}

export function useSendEmail() {
  const { showSuccess, showError } = useSnackbar();

  return useMutation({
    mutationFn: (data: SendEmailParams) => api.sendEmail(data),
    onSuccess: () => {
      showSuccess('Email enviado correctamente');
    },
    onError: (error: any) => {
      const message = error?.message || 'Error al enviar el email';
      showError(message);
    },
  });
}

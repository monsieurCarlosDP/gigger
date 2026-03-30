import { api } from '@/shared/api/client';
import { useSnackbar } from '@/shared/context/SnackbarContext';
import { useMutation } from '@tanstack/react-query';

export function useSendWhatsAppMessage() {
  const { showSuccess, showError } = useSnackbar();

  return useMutation({
    mutationFn: async ({ to, content }: { to: string; content: string }) => {
      const res = await api.sendWhatsAppMessage(to, content);
      return res.data;
    },
    onSuccess: () => {
      showSuccess('Mensaje enviado');
    },
    onError: (err: Error) => {
      showError(err.message);
    },
  });
}

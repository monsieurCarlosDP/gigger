import { api } from '@/shared/api/client';
import { useSnackbar } from '@/shared/context/SnackbarContext';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export function useWhatsAppStatus() {
  const { showError } = useSnackbar();

  const query = useQuery({
    queryKey: ['whatsapp', 'status'],
    queryFn: async () => {
      const res = await api.getWhatsAppStatus();
      return res.data;
    },
    refetchInterval: 5000,
    retry: false,
  });

  useEffect(() => {
    if (query.error) {
      showError(query.error.message);
    }
  }, [query.error, showError]);

  return query;
}

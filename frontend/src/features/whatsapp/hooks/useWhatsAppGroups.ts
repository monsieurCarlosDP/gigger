import { api } from '@/shared/api/client';
import { useSnackbar } from '@/shared/context/SnackbarContext';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export function useWhatsAppGroups(enabled: boolean) {
  const { showError } = useSnackbar();

  const query = useQuery({
    queryKey: ['whatsapp', 'groups'],
    queryFn: async () => {
      const res = await api.getWhatsAppGroups();
      return res.data;
    },
    enabled,
    retry: false,
  });

  useEffect(() => {
    if (query.error) {
      showError(query.error.message);
    }
  }, [query.error, showError]);

  return query;
}

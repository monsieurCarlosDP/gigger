import { api } from '@/shared/api/client';
import { useSnackbar } from '@/shared/context/SnackbarContext';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export function useDiscordChannels() {
  const { showError } = useSnackbar();

  const query = useQuery({
    queryKey: ['discord', 'channels'],
    queryFn: async () => {
      const res = await api.getDiscordChannels();
      return res.data;
    },
    retry: false,
  });

  useEffect(() => {
    if (query.error) {
      showError(query.error.message);
    }
  }, [query.error, showError]);

  return query;
}

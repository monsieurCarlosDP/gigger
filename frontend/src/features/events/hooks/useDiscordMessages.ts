import { api } from '@/shared/api/client';
import { useSnackbar } from '@/shared/context/SnackbarContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export function useDiscordMessages(channelId: string | undefined | null, options?: { polling?: boolean }) {
  const { showError } = useSnackbar();

  const query = useQuery({
    queryKey: ['discord', 'messages', channelId],
    queryFn: async () => {
      const res = await api.getDiscordMessages(channelId!, { limit: 50 });
      return res.data;
    },
    enabled: !!channelId,
    retry: false,
    refetchInterval: options?.polling ? 5000 : false,
    structuralSharing: true,
  });

  useEffect(() => {
    if (query.error) {
      showError(query.error.message);
    }
  }, [query.error, showError]);

  return query;
}

export function useSendDiscordMessage(channelId: string | undefined | null) {
  const queryClient = useQueryClient();
  const { showError } = useSnackbar();

  return useMutation({
    mutationFn: async (content: string) => {
      const res = await api.sendDiscordMessage(channelId!, content);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discord', 'messages', channelId] });
    },
    onError: (err) => {
      showError(err instanceof Error ? err.message : 'Error al enviar mensaje');
    },
  });
}

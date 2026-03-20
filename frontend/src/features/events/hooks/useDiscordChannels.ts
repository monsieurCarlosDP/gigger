import { api } from '@/shared/api/client';
import { useSnackbar } from '@/shared/context/SnackbarContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export function useDiscordCategories() {
  const { showError } = useSnackbar();

  const query = useQuery({
    queryKey: ['discord', 'categories'],
    queryFn: async () => {
      const res = await api.getDiscordCategories();
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

export function useCreateDiscordChannel() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useSnackbar();

  return useMutation({
    mutationFn: async ({ name, categoryId }: { name: string; categoryId?: string }) => {
      const res = await api.createDiscordChannel(name, categoryId);
      return res.data;
    },
    onSuccess: (channel) => {
      showSuccess(`Canal #${channel.name} creado`);
      queryClient.invalidateQueries({ queryKey: ['discord', 'channels'] });
    },
    onError: (err: Error) => {
      showError(err.message);
    },
  });
}

export function useCreateDiscordCategory() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useSnackbar();

  return useMutation({
    mutationFn: async (name: string) => {
      const res = await api.createDiscordCategory(name);
      return res.data;
    },
    onSuccess: (category) => {
      showSuccess(`Categoría ${category.name} creada`);
      queryClient.invalidateQueries({ queryKey: ['discord', 'categories'] });
    },
    onError: (err: Error) => {
      showError(err.message);
    },
  });
}

export function useLinkDiscordChannel(eventDocumentId: string) {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useSnackbar();

  return useMutation({
    mutationFn: async (channelId: string) => {
      return api.updateEvent(eventDocumentId, { data: { DiscordChannelId: channelId } });
    },
    onSuccess: () => {
      showSuccess('Canal vinculado al evento');
      queryClient.invalidateQueries({ queryKey: ['events', eventDocumentId] });
    },
    onError: (err: Error) => {
      showError(err.message);
    },
  });
}

import type { CreateTagBody, TagByIdQuery, TagsQuery, UpdateTagBody } from '@/shared/api/client';
import { api } from '@/shared/api/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const tagsKey = ['tags'] as const;
const tagByIdKey = (id: string) => ['tags', id] as const;

export function useTags(params?: { query?: TagsQuery }) {
  return useQuery({
    queryKey: [...tagsKey, params?.query],
    queryFn: async () => {
      const { data, error } = await api.getTags({ query: params?.query });
      if (error) throw error;
      return data;
    },
  });
}

export function useTagById(
  id: string | undefined | null,
  params?: { query?: TagByIdQuery },
) {
  return useQuery({
    queryKey: [...tagByIdKey(id ?? ''), params?.query],
    queryFn: async () => {
      const { data, error } = await api.getTagById(id!, { query: params?.query });
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: CreateTagBody) => {
      const { data, error } = await api.createTag(body);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagsKey });
    },
  });
}

export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: UpdateTagBody }) => {
      const { data, error } = await api.updateTag(id, body);
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: tagsKey });
      queryClient.invalidateQueries({ queryKey: tagByIdKey(id) });
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await api.deleteTag(id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagsKey });
    },
  });
}

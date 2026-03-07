import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api/client';
import type { ListQuery, EventByIdQuery, CreateEventBody, UpdateEventBody } from '@/shared/api/client';

const eventsKey = ['events'] as const;
const eventByIdKey = (id: string) => ['events', id] as const;

export function useEvents(params?: { query?: ListQuery }) {
  return useQuery({
    queryKey: [...eventsKey, params?.query],
    queryFn: async () => {
      const { data, error } = await api.getEvents({ query: params?.query });
      if (error) throw error;
      return data;
    },
  });
}

export function useEventById(
  id: string | undefined | null,
  params?: { query?: EventByIdQuery },
) {
  return useQuery({
    queryKey: [...eventByIdKey(id ?? ''), params?.query],
    queryFn: async () => {
      const { data, error } = await api.getEventById(id!, { query: params?.query });
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: CreateEventBody) => {
      const { data, error } = await api.createEvent(body);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventsKey });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: UpdateEventBody }) => {
      const { data, error } = await api.updateEvent(id, body);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventsKey });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await api.deleteEvent(id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventsKey });
    },
  });
}

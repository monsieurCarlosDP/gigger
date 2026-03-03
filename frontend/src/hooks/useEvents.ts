import { useQuery } from '@tanstack/react-query';
import { api, type ListQuery, type EventByIdQuery } from '../api/client';

const eventsKey = ['events'] as const;
const eventByIdKey = (id: string) => ['events', id] as const;

/**
 * Fetches the events list. Pass optional query params (pagination, filters, populate, etc.).
 */
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

/**
 * Fetches a single event by id. Skips the request when id is falsy.
 */
export function useEventById(
  id: string | undefined | null,
  params?: { query?: EventByIdQuery }
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

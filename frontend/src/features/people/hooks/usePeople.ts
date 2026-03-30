import type { CreatePersonBody, PersonByIdQuery, PeopleQuery, UpdatePersonBody } from '@/shared/api/client';
import { api } from '@/shared/api/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const peopleKey = ['people'] as const;
const personByIdKey = (id: string) => ['people', id] as const;

export function usePeople(params?: { query?: PeopleQuery }) {
  return useQuery({
    queryKey: [...peopleKey, params?.query],
    queryFn: async () => {
      const { data, error } = await api.getPeople({
        query: {
          ...params?.query,
          populate: params?.query?.populate ? params.query.populate : 'tags',
        } as PeopleQuery,
      });
      if (error) throw error;
      return data;
    },
  });
}

export function usePersonById(
  id: string | undefined | null,
  params?: { query?: PersonByIdQuery },
) {
  return useQuery({
    queryKey: [...personByIdKey(id ?? ''), params?.query],
    queryFn: async () => {
      const { data, error } = await api.getPersonById(id!, {
        query: {
          ...params?.query,
          populate: params?.query?.populate ? params.query.populate : 'tags',
        } as PersonByIdQuery,
      });
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useCreatePerson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: CreatePersonBody) => {
      const { data, error } = await api.createPerson(body);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: peopleKey });
    },
  });
}

export function useUpdatePerson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: UpdatePersonBody }) => {
      const { data, error } = await api.updatePerson(id, body);
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: peopleKey });
      queryClient.invalidateQueries({ queryKey: personByIdKey(id) });
    },
  });
}

export function useDeletePerson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await api.deletePerson(id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: peopleKey });
    },
  });
}

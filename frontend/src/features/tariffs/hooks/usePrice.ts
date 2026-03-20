import { api } from '@/shared/api/client';
import { useQuery } from '@tanstack/react-query';

const priceKey = ['price'] as const;

export function usePrice() {
  const query = useQuery({
    queryKey: priceKey,
    queryFn: async () => {
      const { data, error } = await api.getPrice();
      if (error) throw error;
      return data;
    },
    staleTime: Infinity,
  });

  const attrs = query.data?.data;

  return {
    ...query,
    base: Number(attrs?.Base) || 0,
    dj: Number(attrs?.DJ) || 0,
    equipment: Number(attrs?.Equipment) || 0,
  };
}

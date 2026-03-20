import { api } from '@/shared/api/client';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export function useTarifDistance(distance: number | null | undefined) {
  const { data } = useQuery({
    queryKey: ['tarif-distances'],
    queryFn: async () => {
      const { data, error } = await api.getTarifDistances({
        query: { sort: { minDistance: 'asc' }, pagination: { start:0, limit: 100 } },
      });
      if (error) throw error;
      return data;
    },
    staleTime: Infinity,
  });

  const additionalPrice = useMemo(() => {
    if (distance == null || !data?.data?.length) return null;

    const rows = data.data
      .map((r) => ({
        min: Number(r.minDistance ?? 0),
        price: Number(r.additionalPrice ?? 0),
      }))
      .sort((a, b) => a.min - b.min);

    let matched: (typeof rows)[number] | null = null;
    for (const row of rows) {
      if (row.min <= distance) matched = row;
      else break;
    }

    return matched?.price ?? null;
  }, [distance, data]);

  return additionalPrice;
}

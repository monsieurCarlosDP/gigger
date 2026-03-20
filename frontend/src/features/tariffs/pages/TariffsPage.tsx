import { api } from '@/shared/api/client';
import type { ColumnDef } from '@/shared/components/DataTable';
import { DataTable } from '@/shared/components/DataTable';
import { PageLayout } from '@/shared/layouts/PageLayout';
import { Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

type TarifRow = {
  documentId: string;
  minDistance: string;
  additionalPrice: string;
};

const columns: ColumnDef<TarifRow>[] = [
  {
    key: 'minDistance',
    header: 'Distancia mínima (km)',
    sortValue: (row) => Number(row.minDistance),
    render: (row) => (
      <Typography variant="body2" fontWeight={500}>
        {Number(row.minDistance).toLocaleString('es-ES')} km
      </Typography>
    ),
  },
  {
    key: 'additionalPrice',
    header: 'Precio adicional',
    sortValue: (row) => Number(row.additionalPrice),
    render: (row) => (
      <Typography variant="body2">
        {Number(row.additionalPrice).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
      </Typography>
    ),
  },
];

export default function TariffsPage() {
  const { data, isLoading } = useQuery({
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

  const rows = (data?.data ?? []) as TarifRow[];

  return (
    <PageLayout header={<Typography variant="h6">Tarifas por distancia</Typography>}>
      <DataTable
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.documentId}
        isLoading={isLoading}
        emptyMessage="No hay tarifas configuradas"
        defaultSort={{ key: 'minDistance', direction: 'asc' }}
      />
    </PageLayout>
  );
}

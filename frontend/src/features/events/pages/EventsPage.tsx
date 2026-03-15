import { useEvents } from '@/features/events/hooks/useEvents';
import { DataTable } from '@/shared/components/DataTable';
import type { ColumnDef } from '@/shared/components/DataTable';
import { useDrawerNav } from '@/shared/context/DrawerContext';
import { PageLayout } from '@/shared/layouts/PageLayout';
import { Chip, Typography } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { EventChip } from '../components/EventChip';

dayjs.locale('es');

type EventRow = NonNullable<ReturnType<typeof useEvents>['data']>['data'][number];

const columns: ColumnDef<EventRow>[] = [
  {
    key: 'name',
    header: 'Nombre',
    render: (row) => (
      <Typography
        variant="body2"
        fontWeight={500}
        sx={row.Cancelled ? { textDecoration: 'line-through', color: 'text.disabled' } : undefined}
      >
        {row.Name}
      </Typography>
    ),
  },
  {
    key: 'type',
    header: 'Tipo',
    render: (row) => <EventChip type={row.Type} />,
  },
  {
    key: 'date',
    header: 'Fecha',
    render: (row) => (
      <Typography variant="body2">
        {row.Period && row.EndDate
          ? `${dayjs(row.StartDate).format('D MMM YYYY')} — ${dayjs(row.EndDate).format('D MMM YYYY')}`
          : dayjs(row.StartDate).format('D MMM YYYY')}
      </Typography>
    ),
  },
  {
    key: 'location',
    header: 'Lugar',
    render: (row) => (
      <Typography variant="body2" color="text.secondary">
        {row.Location ?? '—'}
      </Typography>
    ),
  },
  {
    key: 'status',
    header: 'Estado',
    align: 'center',
    render: (row) =>
      row.Cancelled ? (
        <Chip label="Cancelado" size="small" color="default" />
      ) : (
        <Chip label="Activo" size="small" color="success" />
      ),
  },
];

export default function EventsPage() {
  const { data, isLoading } = useEvents();
  const { openEventDrawer } = useDrawerNav();

  const rows = data?.data ?? [];

  return (
    <PageLayout header={<Typography variant="h6">Eventos</Typography>}>
      <DataTable
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.documentId}
        isLoading={isLoading}
        emptyMessage="No hay eventos"
        onRowClick={(row) => openEventDrawer(row.documentId)}
      />
    </PageLayout>
  );
}

import type { EventType } from '@/features/events/hooks/useEvents';
import { useEvents } from '@/features/events/hooks/useEvents';
import { DataTable } from '@/shared/components/DataTable';
import type { ColumnDef } from '@/shared/components/DataTable';
import { PopperButton } from '@/shared/components/PopperButton';
import { useDrawerNav } from '@/shared/context/DrawerContext';
import { PageLayout } from '@/shared/layouts/PageLayout';
import FilterListIcon from '@mui/icons-material/FilterList';
import PaidIcon from '@mui/icons-material/Paid';
import SearchIcon from '@mui/icons-material/Search';
import { Checkbox, Chip, FormControlLabel, InputAdornment, Stack, TextField, Tooltip, Typography } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useMemo, useState } from 'react';
import { EventChip } from '../components/EventChip';

dayjs.locale('es');

type EventRow = NonNullable<ReturnType<typeof useEvents>['data']>['data'][number];

const columns: ColumnDef<EventRow>[] = [
  {
    key: 'name',
    header: 'Nombre',
    sortValue: (row) => row.Name.toLowerCase(),
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
    key: 'gigType',
    header: 'Subtipo',
    render: (row) => {
      if (!row.GigType) return null;
      const config: Record<string, { label: string; color: 'primary' | 'secondary' | 'info' | 'default' }> = {
        Wedding: { label: 'Boda', color: 'primary' },
        Party: { label: 'Fiesta privada', color: 'secondary' },
        Village: { label: 'Fiesta patronal', color: 'info' },
        Gig: { label: 'Bolo/concierto', color: 'default' },
      };
      const c = config[row.GigType];
      return c ? <Chip label={c.label} color={c.color} size="small" variant="outlined" /> : null;
    },
  },
  {
    key: 'date',
    header: 'Fecha',
    sortValue: (row) => row.StartDate,
    render: (row) => (
      <Typography variant="body2">
        {row.Type === 'Viability' && row.EndDate
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
    key: 'budget',
    header: <PaidIcon fontSize="small" color="action" />,
    align: 'center',
    width: 48,
    render: (row) => {
      const budgets = (row.Budget as { Accepted?: boolean | null }[] | undefined) ?? [];
      if (budgets.length === 0) return null;
      const hasAccepted = budgets.some((b) => b.Accepted);
      return (
        <Tooltip title={hasAccepted ? 'Presupuesto aceptado' : 'Presupuesto pendiente'}>
          <span>{hasAccepted ? '✅' : '❌'}</span>
        </Tooltip>
      );
    },
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

const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: 'Reservation', label: 'Reserva' },
  { value: 'Event', label: 'Evento' },
  { value: 'Viability', label: 'Disponibilidad' },
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Activo' },
  { value: 'cancelled', label: 'Cancelado' },
] as const;

type StatusFilter = (typeof STATUS_OPTIONS)[number]['value'];

export default function EventsPage() {
  const { data, isLoading } = useEvents({ query: { populate: ['Budget'] } });
  const { openEventDrawer } = useDrawerNav();
  const [search, setSearch] = useState('');
  const [typeFilters, setTypeFilters] = useState<Set<EventType>>(new Set(['Reservation', 'Event', 'Viability']));
  const [statusFilters, setStatusFilters] = useState<Set<StatusFilter>>(new Set(['active', 'cancelled']));
  const [hidePast, setHidePast] = useState(false);

  const rows = data?.data ?? [];

  const toggleType = (type: EventType) => {
    setTypeFilters((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const toggleStatus = (status: StatusFilter) => {
    setStatusFilters((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  };

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      // Type filter
      if (!typeFilters.has(row.Type as EventType)) return false;
      // Status filter
      const status: StatusFilter = row.Cancelled ? 'cancelled' : 'active';
      if (!statusFilters.has(status)) return false;
      // Hide past events
      if (hidePast && dayjs(row.StartDate).isBefore(dayjs(), 'day')) return false;
      // Search
      const term = search.toLowerCase().trim();
      if (term) {
        return (
          row.Name.toLowerCase().includes(term) ||
          (row.Location?.toLowerCase().includes(term) ?? false)
        );
      }
      return true;
    });
  }, [rows, search, typeFilters, statusFilters, hidePast]);

  return (
    <PageLayout
      header={
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{ width: '100%' }}>
          <Typography variant="h6">Eventos</Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <TextField
              placeholder="Buscar por nombre o lugar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ maxWidth: 400, minWidth: 200 }}
            />
            <Tooltip title="Ocultar eventos pasados">
              <FormControlLabel
                control={<Checkbox size="small" checked={hidePast} onChange={(e) => setHidePast(e.target.checked)} />}
                label="Ocultar pasados"
                sx={{ mr: 0 }}
              />
            </Tooltip>
            <PopperButton
              label="Tipo"
              buttonProps={{ variant: 'outlined', size: 'small', startIcon: <FilterListIcon /> }}
            >
              <Stack sx={{ p: 2, minWidth: 180 }}>
                {EVENT_TYPES.map((t) => (
                  <FormControlLabel
                    key={t.value}
                    control={
                      <Checkbox
                        size="small"
                        checked={typeFilters.has(t.value)}
                        onChange={() => toggleType(t.value)}
                      />
                    }
                    label={t.label}
                  />
                ))}
              </Stack>
            </PopperButton>
            <PopperButton
              label="Estado"
              buttonProps={{ variant: 'outlined', size: 'small', startIcon: <FilterListIcon /> }}
            >
              <Stack sx={{ p: 2, minWidth: 180 }}>
                {STATUS_OPTIONS.map((s) => (
                  <FormControlLabel
                    key={s.value}
                    control={
                      <Checkbox
                        size="small"
                        checked={statusFilters.has(s.value)}
                        onChange={() => toggleStatus(s.value)}
                      />
                    }
                    label={s.label}
                  />
                ))}
              </Stack>
            </PopperButton>
          </Stack>
        </Stack>
      }
    >
      <DataTable
        columns={columns}
        rows={filteredRows}
        getRowKey={(row) => row.documentId}
        isLoading={isLoading}
        emptyMessage={search ? 'Sin resultados' : 'No hay eventos'}
        onRowClick={(row) => openEventDrawer(row.documentId)}
      />
    </PageLayout>
  );
}

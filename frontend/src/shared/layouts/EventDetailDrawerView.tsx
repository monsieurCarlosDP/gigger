import { EventChip } from '@/features/events/components/EventChip';
import { useEventById } from '@/features/events/hooks/useEvents';
import BlockIcon from '@mui/icons-material/Block';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditIcon from '@mui/icons-material/Edit';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import RouteIcon from '@mui/icons-material/Route';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useNavigate } from 'react-router-dom';

dayjs.locale('es');

interface EventDetailDrawerViewProps {
  id: string;
}

export function EventDetailDrawerView({ id }: EventDetailDrawerViewProps) {
  const navigate = useNavigate();
  const { data, isLoading } = useEventById(id, {
    query: { populate: ['contacts', 'Budget'] },
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const event = data?.data;
  if (!event) {
    return <Typography color="textSecondary">Evento no encontrado</Typography>;
  }

  const isPeriod = event.Period && event.EndDate;
  const isCancelled = event.Cancelled === true;
  const acceptedBudget = event.Budget?.find((b) => b.Accepted === true);

  return (
    <Stack spacing={3}>

      {/* Header */}
      <Stack spacing={1}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
          <Typography
            variant="h5"
            sx={isCancelled ? { textDecoration: 'line-through', color: 'text.disabled' } : undefined}
          >
            {event.Name}
          </Typography>
          <Stack direction="row" spacing={0.5}>
            {isCancelled && (
              <Chip icon={<BlockIcon />} label="Cancelado" size="small" color="default" />
            )}
            <EventChip type={event.Type} />
          </Stack>
        </Stack>

        {isCancelled && event.CancelledDate && (
          <Typography variant="caption" color="text.secondary">
            Cancelado el {dayjs(event.CancelledDate).format('D [de] MMMM [de] YYYY')}
          </Typography>
        )}
      </Stack>

      <Divider />

      {/* Fecha y ubicación */}
      <Stack spacing={1.5}>
        <Stack direction="row" alignItems="center" gap={1}>
          <CalendarTodayIcon fontSize="small" color="action" />
          <Typography variant="body2">
            {isPeriod
              ? `${dayjs(event.StartDate).format('D MMM YYYY')} — ${dayjs(event.EndDate).format('D MMM YYYY')}`
              : dayjs(event.StartDate).format('dddd, D [de] MMMM [de] YYYY')}
          </Typography>
        </Stack>

        {event.Location && (
          <Stack direction="row" alignItems="center" gap={1}>
            <LocationOnIcon fontSize="small" color="action" />
            <Typography variant="body2">{event.Location}</Typography>
          </Stack>
        )}

        {event.Distance && (
          <Stack direction="row" alignItems="center" gap={1}>
            <RouteIcon fontSize="small" color="action" />
            <Typography variant="body2">{event.Distance} km</Typography>
          </Stack>
        )}
      </Stack>

      {/* Contactos */}
      {event.contacts && event.contacts.length > 0 && (
        <>
          <Divider />
          <Stack spacing={1}>
            <Typography variant="subtitle2" color="text.secondary">
              Contactos
            </Typography>
            {event.contacts.map((contact) => (
              <Stack key={contact.documentId} direction="row" alignItems="center" gap={1}>
                <PersonIcon fontSize="small" color="action" />
                <Stack>
                  <Typography variant="body2">{contact.Name}</Typography>
                  {contact.Type && (
                    <Typography variant="caption" color="text.secondary">
                      {contact.Type}
                    </Typography>
                  )}
                </Stack>
              </Stack>
            ))}
          </Stack>
        </>
      )}

      {/* Presupuestos */}
      {event.Budget && event.Budget.length > 0 && (
        <>
          <Divider />
          <Stack spacing={1}>
            <Typography variant="subtitle2" color="text.secondary">
              Presupuestos
            </Typography>
            {event.Budget.map((budget, index) => (
              <Box
                key={index}
                sx={{
                  p: 1.5,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: budget.Accepted ? 'success.main' : 'divider',
                  bgcolor: budget.Accepted ? 'success.50' : 'background.paper',
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" fontWeight={500}>
                    Presupuesto {index + 1}
                    {budget.Accepted && (
                      <Chip label="Aceptado" size="small" color="success" sx={{ ml: 1 }} />
                    )}
                  </Typography>
                  {budget.Base != null && (
                    <Typography variant="body2" fontWeight={600}>
                      {budget.Base} €
                    </Typography>
                  )}
                </Stack>
                <Stack direction="row" spacing={1} mt={0.5} flexWrap="wrap">
                  {budget.Dietas != null && (
                    <Typography variant="caption" color="text.secondary">
                      Dietas: {budget.Dietas} €
                    </Typography>
                  )}
                  {budget.Equipment && (
                    <Typography variant="caption" color="text.secondary">· Equipo</Typography>
                  )}
                  {budget.DJ && (
                    <Typography variant="caption" color="text.secondary">· DJ</Typography>
                  )}
                </Stack>
              </Box>
            ))}
          </Stack>
        </>
      )}

      <Divider />

      {/* Acciones */}
      <Stack spacing={1}>
        <Button
          variant="contained"
          startIcon={<OpenInFullIcon />}
          fullWidth
          onClick={() => navigate(`/events/${event.documentId}`)}
        >
          Ver página completa
        </Button>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          fullWidth
          onClick={() => navigate(`/events/${event.documentId}/edit`)}
        >
          Editar evento
        </Button>
      </Stack>

    </Stack>
  );
}

import { EventChip } from '@/features/events/components/EventChip';
import { useEventById } from '@/features/events/hooks/useEvents';
import { PageLayout } from '@/shared/layouts/PageLayout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BlockIcon from '@mui/icons-material/Block';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditIcon from '@mui/icons-material/Edit';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import RouteIcon from '@mui/icons-material/Route';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useNavigate, useParams } from 'react-router-dom';

dayjs.locale('es');

export default function EventDetailPage() {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useEventById(documentId ?? '', {
    query: { populate: ['contacts', 'Budget'] },
  });

  const event = data?.data;
  const isPeriod = event?.Period && event?.EndDate;
  const isCancelled = event?.Cancelled === true;

  return (
    <PageLayout
      header={
        <Stack direction="row" alignItems="center" gap={1}>
          <IconButton onClick={() => navigate(-1)} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {isLoading ? 'Cargando...' : (event?.Name ?? 'Evento')}
          </Typography>
          {event && (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/events/${event.documentId}/edit`)}
              size="small"
            >
              Editar
            </Button>
          )}
        </Stack>
      }
    >
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}>
          <CircularProgress />
        </Box>
      ) : !event ? (
        <Typography color="textSecondary">Evento no encontrado</Typography>
      ) : (
        <Box sx={{ maxWidth: 900, mx: 'auto', width: '100%' }}>
          <Grid container spacing={3}>

            {/* Columna principal */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack spacing={3}>

                {/* Info general */}
                <Paper elevation={2} sx={{ p: 3 }}>
                  <Stack spacing={2}>
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
                      <Typography variant="body2" color="text.secondary">
                        Cancelado el {dayjs(event.CancelledDate).format('D [de] MMMM [de] YYYY')}
                      </Typography>
                    )}

                    <Divider />

                    <Stack spacing={1.5}>
                      <Stack direction="row" alignItems="center" gap={1.5}>
                        <CalendarTodayIcon fontSize="small" color="action" />
                        <Typography variant="body1">
                          {isPeriod
                            ? `${dayjs(event.StartDate).format('D [de] MMMM [de] YYYY')} — ${dayjs(event.EndDate).format('D [de] MMMM [de] YYYY')}`
                            : dayjs(event.StartDate).format('dddd, D [de] MMMM [de] YYYY')}
                        </Typography>
                      </Stack>

                      {event.Location && (
                        <Stack direction="row" alignItems="center" gap={1.5}>
                          <LocationOnIcon fontSize="small" color="action" />
                          <Typography variant="body1">{event.Location}</Typography>
                        </Stack>
                      )}

                      {event.Distance && (
                        <Stack direction="row" alignItems="center" gap={1.5}>
                          <RouteIcon fontSize="small" color="action" />
                          <Typography variant="body1">{event.Distance} km</Typography>
                        </Stack>
                      )}
                    </Stack>
                  </Stack>
                </Paper>

                {/* Contactos */}
                {event.contacts && event.contacts.length > 0 && (
                  <Paper elevation={2} sx={{ p: 3 }}>
                    <Stack spacing={2}>
                      <Typography variant="h6">Contactos</Typography>
                      <Divider />
                      {event.contacts.map((contact) => (
                        <Stack key={contact.documentId} direction="row" alignItems="center" gap={2}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              bgcolor: 'primary.light',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <PersonIcon fontSize="small" sx={{ color: 'primary.contrastText' }} />
                          </Box>
                          <Stack flexGrow={1}>
                            <Typography variant="body1" fontWeight={500}>{contact.Name}</Typography>
                            <Stack direction="row" spacing={1}>
                              {contact.Type && (
                                <Typography variant="caption" color="text.secondary">{contact.Type}</Typography>
                              )}
                              {contact.Email && (
                                <Typography variant="caption" color="text.secondary">· {contact.Email}</Typography>
                              )}
                              {contact.Number && (
                                <Typography variant="caption" color="text.secondary">· {contact.Number}</Typography>
                              )}
                            </Stack>
                          </Stack>
                        </Stack>
                      ))}
                    </Stack>
                  </Paper>
                )}

              </Stack>
            </Grid>

            {/* Columna lateral — Presupuestos */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Typography variant="h6">Presupuestos</Typography>
                  <Divider />

                  {!event.Budget || event.Budget.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      Sin presupuestos
                    </Typography>
                  ) : (
                    event.Budget.map((budget, index) => (
                      <Box
                        key={index}
                        sx={{
                          p: 2,
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: budget.Accepted ? 'success.main' : 'divider',
                          bgcolor: budget.Accepted ? 'success.50' : 'background.default',
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                          <Stack spacing={0.5}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Typography variant="body2" fontWeight={600}>
                                Presupuesto {index + 1}
                              </Typography>
                              {budget.Accepted && (
                                <Chip label="Aceptado" size="small" color="success" />
                              )}
                            </Stack>
                            <Stack spacing={0.25}>
                              {budget.Dietas != null && (
                                <Typography variant="caption" color="text.secondary">
                                  Dietas: {budget.Dietas} €
                                </Typography>
                              )}
                              {budget.Equipment && (
                                <Typography variant="caption" color="text.secondary">· Equipo incluido</Typography>
                              )}
                              {budget.DJ && (
                                <Typography variant="caption" color="text.secondary">· DJ incluido</Typography>
                              )}
                            </Stack>
                          </Stack>
                          {budget.Base != null && (
                            <Typography variant="h6" color={budget.Accepted ? 'success.main' : 'text.primary'}>
                              {budget.Base} €
                            </Typography>
                          )}
                        </Stack>
                      </Box>
                    ))
                  )}
                </Stack>
              </Paper>
            </Grid>

          </Grid>
        </Box>
      )}
    </PageLayout>
  );
}

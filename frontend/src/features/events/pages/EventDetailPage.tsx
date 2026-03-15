import { EventChip } from '@/features/events/components/EventChip';
import { Timeline } from '@/shared/components/Timeline';
import { useDiscordChannels } from '@/features/events/hooks/useDiscordChannels';
import { useDiscordMessages, useSendDiscordMessage } from '@/features/events/hooks/useDiscordMessages';
import { useEventById } from '@/features/events/hooks/useEvents';
import { ChatBubble } from '@/shared/components/ChatBubble';
import { ChatInput } from '@/shared/components/ChatInput';
import { useDrawerNav } from '@/shared/context/DrawerContext';
import { PageLayout } from '@/shared/layouts/PageLayout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BlockIcon from '@mui/icons-material/Block';
import BuildIcon from '@mui/icons-material/Build';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EditIcon from '@mui/icons-material/Edit';
import FlagIcon from '@mui/icons-material/Flag';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import NightlightIcon from '@mui/icons-material/Nightlight';
import PersonIcon from '@mui/icons-material/Person';
import RouteIcon from '@mui/icons-material/Route';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useEventTabParam } from '@/shared/context/DrawerContext';
import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

dayjs.locale('es');

export default function EventDetailPage() {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const { openEventDrawer } = useDrawerNav();
  const { tabIndex: tab, tabName, setTab } = useEventTabParam();

  const { data, isLoading } = useEventById(documentId ?? '', {
    query: { populate: ['contacts', 'Budget'] },
  });

  const { data: channels = [], isLoading: channelsLoading } = useDiscordChannels();

  const event = data?.data;
  const { data: messages = [], isLoading: messagesLoading } = useDiscordMessages(event?.DiscordChannelId, { polling: tab === 3 });
  const { mutate: sendMessage, isPending: isSending } = useSendDiscordMessage(event?.DiscordChannelId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, tab]);
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
            <>
              {isCancelled && (
                <Chip icon={<BlockIcon />} label="Cancelado" size="small" color="default" />
              )}
              <EventChip type={event.Type} />
              <IconButton
                onClick={() => {
                  navigate('/');
                  openEventDrawer(event.documentId, tabName);
                }}
                size="small"
                title="Ver en panel lateral"
              >
                <CloseFullscreenIcon />
              </IconButton>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/events/${event.documentId}/edit`)}
                size="small"
              >
                Editar
              </Button>
            </>
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
          <Box sx={{ position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1, pb: 0.5 }}>
          <Tabs value={tab} onChange={(_e, v: number) => setTab(v)} sx={{ mb: 3 }}>
            <Tab label="Info" />
            <Tab label="Logística" />
            <Tab label="Económica" />
            <Tab label="Conversación" />
          </Tabs>
          </Box>

          {/* Tab: Info */}
          {tab === 0 && (
            <Stack spacing={3}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Stack spacing={2}>
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
          )}

          {/* Tab: Logística */}
          {tab === 1 && (
            <Stack spacing={3}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Typography variant="h6">Cronología</Typography>
                  <Divider />
                  <Timeline
                    items={[
                      { time: '08:00', label: 'Carga de equipo', description: 'Almacén central', icon: <Inventory2Icon sx={{ fontSize: 18 }} />, color: '#546e7a' },
                      { time: '08:45', label: 'Recoger a Carlos', description: 'C/ Gran Vía 12', photo: 'https://i.pravatar.cc/150?u=carlos' },
                      { time: '09:30', label: 'Salida', description: 'Viaje estimado: 2h 15min', icon: <DirectionsCarIcon sx={{ fontSize: 18 }} />, color: '#1565c0' },
                      { time: '11:45', label: 'Llegada y montaje', description: 'Recinto ferial, puerta B', icon: <BuildIcon sx={{ fontSize: 18 }} />, color: '#ef6c00' },
                      { time: '14:00', label: 'Inicio del evento', icon: <MusicNoteIcon sx={{ fontSize: 18 }} />, color: '#2e7d32' },
                      { time: '22:00', label: 'Fin del evento', icon: <FlagIcon sx={{ fontSize: 18 }} />, color: '#2e7d32' },
                      { time: '22:30', label: 'Desmontaje', icon: <BuildIcon sx={{ fontSize: 18 }} />, color: '#ef6c00' },
                      { time: '23:30', label: 'Llegada a casa', icon: <NightlightIcon sx={{ fontSize: 18 }} />, color: '#37474f' },
                    ]}
                  />
                </Stack>
              </Paper>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Mapa de ruta próximamente.
                </Typography>
              </Paper>
            </Stack>
          )}

          {/* Tab: Económica */}
          {tab === 2 && (
            <Stack spacing={3}>
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

            </Stack>
          )}

          {/* Tab: Conversación */}
          {tab === 3 && (
            <Stack spacing={3}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Typography variant="h6">Canal de Discord</Typography>
                  <Divider />
                  <Autocomplete
                    options={channels}
                    getOptionLabel={(option) => `#${option.name}`}
                    loading={channelsLoading}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Buscar canal..."
                        size="small"
                      />
                    )}
                    onChange={(_e, value) => {
                      console.log('Canal seleccionado:', value);
                    }}
                  />
                </Stack>
              </Paper>

              {event.DiscordChannelId && (
                <Paper elevation={2} sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <Typography variant="h6">Mensajes</Typography>
                    <Divider />
                    {messagesLoading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress size={28} />
                      </Box>
                    ) : messages.length === 0 ? (
                      <Typography variant="body2" color="text.secondary" textAlign="center">
                        No hay mensajes en este canal.
                      </Typography>
                    ) : (
                      <Stack spacing={1.5}>
                        {[...messages].reverse().map((msg) => (
                            <ChatBubble
                              key={msg.id}
                              variant={msg.author.bot ? 'sent' : 'received'}
                              content={msg.content || '[Adjunto]'}
                              author={msg.author.username}
                              avatar={msg.author.avatar}
                              timestamp={dayjs(msg.timestamp).format('D MMM YYYY, HH:mm')}
                            />
                          ))}
                        <div ref={messagesEndRef} />
                      </Stack>
                    )}
                    <Box sx={{ position: 'sticky', bottom: 0, bgcolor: 'background.paper', pt: 1, pb: 0.5 }}>
                      <ChatInput
                        disabled={!event.DiscordChannelId || isSending}
                        placeholder={event.DiscordChannelId ? 'Escribe un mensaje...' : 'Próximamente...'}
                        onSend={(content) => sendMessage(content)}
                      />
                    </Box>
                  </Stack>
                </Paper>
              )}
            </Stack>
          )}
        </Box>
      )}
    </PageLayout>
  );
}

import { EventChip } from '@/features/events/components/EventChip';
import { Timeline } from '@/shared/components/Timeline';
import { useDiscordMessages, useSendDiscordMessage } from '@/features/events/hooks/useDiscordMessages';
import { useEventById } from '@/features/events/hooks/useEvents';
import { ChatBubble } from '@/shared/components/ChatBubble';
import { ChatInput } from '@/shared/components/ChatInput';
import { useDrawerNav, useEventTabParam } from '@/shared/context/DrawerContext';
import BlockIcon from '@mui/icons-material/Block';
import BuildIcon from '@mui/icons-material/Build';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ChatIcon from '@mui/icons-material/Chat';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EditIcon from '@mui/icons-material/Edit';
import EuroIcon from '@mui/icons-material/Euro';
import FlagIcon from '@mui/icons-material/Flag';
import InfoIcon from '@mui/icons-material/Info';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import NightlightIcon from '@mui/icons-material/Nightlight';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import PersonIcon from '@mui/icons-material/Person';
import RouteIcon from '@mui/icons-material/Route';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

dayjs.locale('es');

interface EventDetailDrawerViewProps {
  id: string;
}

export function EventDetailDrawerView({ id }: EventDetailDrawerViewProps) {
  const navigate = useNavigate();
  const { openBudgetsDrawer } = useDrawerNav();
  const { tabIndex: tab, setTab } = useEventTabParam();
  const { data, isLoading } = useEventById(id, {
    query: { populate: ['contacts', 'Budget'] },
  });
  const event = data?.data;
  const { data: messages = [], isLoading: messagesLoading } = useDiscordMessages(event?.DiscordChannelId, { polling: tab === 3 });
  const { mutate: sendMessage, isPending: isSending } = useSendDiscordMessage(event?.DiscordChannelId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, tab]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!event) {
    return <Typography color="textSecondary">Evento no encontrado</Typography>;
  }

  const isPeriod = event.Period && event.EndDate;
  const isCancelled = event.Cancelled === true;

  return (
    <Stack spacing={0} sx={{ height: '100%' }}>

      {/* Header + Tabs — sticky */}
      <Box sx={{ position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1, pb: 0.5 }}>
      <Stack spacing={1} sx={{ pb: 1 }}>
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

      {/* Tabs */}
      <Tabs value={tab} onChange={(_e, v: number) => setTab(v)} variant="fullWidth" sx={{ mb: 2 }}>
        <Tab icon={<InfoIcon />} aria-label="Info" />
        <Tab icon={<LocalShippingIcon />} aria-label="Logística" />
        <Tab icon={<EuroIcon />} aria-label="Económica" />
        <Tab icon={<ChatIcon />} aria-label="Conversación" />
      </Tabs>
      </Box>

      {/* Tab: Info */}
      {tab === 0 && (
        <Stack spacing={3}>
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

          <Divider />

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
      )}

      {/* Tab: Logística */}
      {tab === 1 && (
        <Stack spacing={2}>
          <Typography variant="subtitle2" color="text.secondary">
            Cronología
          </Typography>
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
          <Divider />
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Mapa de ruta próximamente.
          </Typography>
        </Stack>
      )}

      {/* Tab: Económica */}
      {tab === 2 && (
        <Stack spacing={3}>
          {event.Budget && event.Budget.length > 0 && (
            <Stack spacing={1}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle2" color="text.secondary">
                  Presupuestos ({event.Budget.length})
                </Typography>
                {event.Budget.some((b) => b.Accepted) && (
                  <Chip label="1 aceptado" size="small" color="success" />
                )}
              </Stack>
              <Button
                variant="outlined"
                size="small"
                fullWidth
                onClick={() => openBudgetsDrawer(event.documentId)}
              >
                Ver presupuestos
              </Button>
            </Stack>
          )}

          <Typography variant="body2" color="text.secondary" textAlign="center">
            Más opciones económicas próximamente.
          </Typography>
        </Stack>
      )}

      {/* Tab: Conversación */}
      {tab === 3 && (
        <Stack spacing={1.5} sx={{ py: 1, flexGrow: 1 }}>
          <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
            {!event.DiscordChannelId ? (
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Este evento no tiene un canal de Discord vinculado.
              </Typography>
            ) : messagesLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
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
          </Box>
          <Box sx={{ position: 'sticky', bottom: 0, bgcolor: 'background.paper', pt: 1, pb: 0.5 }}>
            <ChatInput
              disabled={!event.DiscordChannelId || isSending}
              placeholder={event.DiscordChannelId ? 'Escribe un mensaje...' : 'Próximamente...'}
              onSend={(content) => sendMessage(content)}
            />
          </Box>
        </Stack>
      )}
    </Stack>
  );
}

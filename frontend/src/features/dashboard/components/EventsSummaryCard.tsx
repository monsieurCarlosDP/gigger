import { EventChip } from '@/features/events/components/EventChip';
import type { EventType } from '@/features/events/hooks/useEvents';
import Card from '@/shared/components/Card';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BlockIcon from '@mui/icons-material/Block';
import EventIcon from '@mui/icons-material/Event';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.locale('es');

type Event = {
  id?: string | number;
  documentId?: string;
  Name: string;
  Description?: string;
  StartDate: string;
  EndDate?: string;
  Period?: boolean | null;
  Distance?: string;
  Location?: string;
  Type?: EventType;
  Cancelled?: boolean | null;
  CancelledDate?: string;
};

type EventCardProps = {
  event: Event;
  onEventClick?: (eventId: string | number | undefined) => void;
};

export function EventCard({ event, onEventClick }: EventCardProps) {
  const startDate = dayjs(event.StartDate);
  const isPeriod = event.Period && event.EndDate;
  const isCancelled = event.Cancelled === true;

  return (
    <Box sx={isCancelled ? { opacity: 0.6 } : undefined}>
    <Card
      headerContent={
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography
            variant="subtitle1"
            sx={isCancelled ? { textDecoration: 'line-through' } : undefined}
          >
            {event.Name}
          </Typography>
          <Stack direction="row" spacing={0.5}>
            {isCancelled && (
              <Chip
                icon={<BlockIcon />}
                label="Cancelado"
                size="small"
                color="default"
              />
            )}
            {event.Type && <EventChip type={event.Type} />}
          </Stack>
        </Stack>
      }
      cardContent={
        <Stack spacing={1.5}>
          <Box>
            <Typography variant="body2" color="textSecondary">
              {event.Description}
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <EventIcon fontSize="small" color={isCancelled ? 'disabled' : 'primary'} />
              <Typography variant="body2">
                {isPeriod
                  ? `${startDate.format('D MMM')} - ${dayjs(event.EndDate).format('D MMM')}`
                  : startDate.format('dddd, D [de] MMMM')}
              </Typography>
            </Box>
          </Stack>

          {isCancelled && event.CancelledDate && (
            <Typography variant="caption" color="text.secondary">
              Cancelado el {dayjs(event.CancelledDate).format('D [de] MMMM [de] YYYY')}
            </Typography>
          )}

          {!isPeriod && !isCancelled && (
            <Stack direction="row" spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccessTimeIcon fontSize="small" color="success" />
                <Typography variant="body2" color="success.main" sx={{ fontWeight: 500 }}>
                  {startDate.fromNow()}
                </Typography>
              </Box>
            </Stack>
          )}
        </Stack>
      }
      cardMainAction={() => event.id && onEventClick?.(event.id)}
      cardActions={
        <Button
          size="small"
          variant={isCancelled ? 'outlined' : 'contained'}
          fullWidth
          onClick={() => event.id && onEventClick?.(event.id)}
        >
          Ver detalles
        </Button>
      }
    />
    </Box>
  );
}

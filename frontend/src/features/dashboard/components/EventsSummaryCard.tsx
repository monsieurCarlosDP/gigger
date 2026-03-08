import type { EventType } from '@/features/events/hooks/useEvents';
import Card from '@/shared/components/Card';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import { Box, Button, Stack, Typography } from '@mui/material';
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
};

type EventCardProps = {
  event: Event;
  onEventClick?: (eventId: string | number | undefined) => void;
};

export function EventCard({ event, onEventClick }: EventCardProps) {
  const startDate = dayjs(event.StartDate);
  const isPeriod = event.Period && event.EndDate;

  return (
    <Card
      headerContent={event.Name}
      cardContent={
        <Stack spacing={1.5}>
          <Box>
            <Typography variant="body2" color="textSecondary">
              {event.Description}
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <EventIcon fontSize="small" color="primary" />
              <Typography variant="body2">
                {isPeriod
                  ? `${startDate.format('D MMM')} - ${dayjs(event.EndDate).format('D MMM')}`
                  : startDate.format('dddd, D [de] MMMM')}
              </Typography>
            </Box>
          </Stack>

          {!isPeriod && (
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
          variant="contained"
          fullWidth
          onClick={() => event.id && onEventClick?.(event.id)}
        >
          Ver detalles
        </Button>
      }
    />
  );
}

import { EventCard } from '@/features/dashboard/components/EventsSummaryCard';
import { useEvents } from '@/features/events/hooks/useEvents';
import { useDrawerNav } from '@/shared/context/DrawerContext';
import { Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');

interface DayEventsDrawerViewProps {
  date: string;
}

export function DayEventsDrawerView({ date }: DayEventsDrawerViewProps) {
  const { data } = useEvents();
  const { openEventDrawer } = useDrawerNav();

  const dayEvents = (data?.data ?? []).filter((event) => {
    if (event.Period && event.EndDate) {
      const d = dayjs(date);
      return (
        (d.isSame(dayjs(event.StartDate), 'day') || d.isAfter(dayjs(event.StartDate), 'day')) &&
        (d.isSame(dayjs(event.EndDate), 'day') || d.isBefore(dayjs(event.EndDate), 'day'))
      );
    }
    return dayjs(event.StartDate).format('YYYY-MM-DD') === date;
  });

  return (
    <Stack spacing={2}>
      <Typography variant="h6">
        Eventos del {dayjs(date).format('D [de] MMMM [de] YYYY')}
      </Typography>
      {dayEvents.length === 0 ? (
        <Typography color="textSecondary">No hay eventos para este día</Typography>
      ) : (
        dayEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onEventClick={(id) => {
              const documentId = event.documentId ?? String(id);
              openEventDrawer(documentId);
            }}
          />
        ))
      )}
    </Stack>
  );
}

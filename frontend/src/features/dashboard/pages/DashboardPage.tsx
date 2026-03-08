import { useEvents, useUpcomingEvents } from '@/features/events/hooks/useEvents';
import type { BlockedRange, DayMark } from '@/shared/components/Calendar';
import { Calendar } from '@/shared/components/Calendar';
import { PageLayout } from '@/shared/layouts/PageLayout';
import { Box, CircularProgress, Paper, Popper, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useCallback, useMemo, useRef, useState } from 'react';
import { DashboardHeader } from '../components/DashboardHeader';
import { EventCard } from '../components/EventsSummaryCard';


export default function DashboardPage() {
  const { data, isLoading } = useEvents();
  const { data: upcomingEvents } = useUpcomingEvents({ limit: 5, type: ['Event', 'Reservation'] });

  const [popperAnchor, setPopperAnchor] = useState<HTMLElement | null>(null);
  const [hoveredDateKey, setHoveredDateKey] = useState<string | null>(null);
  const leaveTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  const { markedDays, blockedRanges, eventsByDate } = useMemo(() => {
    const markedDays: Record<string, DayMark[]> = {};
    const blockedRanges: BlockedRange[] = [];
    const eventsByDate: Record<string, NonNullable<typeof data>['data']> = {};

    for (const event of data?.data ?? []) {
      if (event.Period && event.EndDate) {
        blockedRanges.push({
          start: dayjs(event.StartDate),
          end: dayjs(event.EndDate),
        });
        // Index each day within the period for popper lookup
        let cursor = dayjs(event.StartDate);
        const end = dayjs(event.EndDate);
        while (cursor.isBefore(end, 'day') || cursor.isSame(end, 'day')) {
          const k = cursor.format('YYYY-MM-DD');
          eventsByDate[k] = [...(eventsByDate[k] ?? []), event];
          cursor = cursor.add(1, 'day');
        }
      } else {
        const key = dayjs(event.StartDate).format('YYYY-MM-DD');
        markedDays[key] = [...(markedDays[key] ?? []), { color: 'primary.main' }];
        eventsByDate[key] = [...(eventsByDate[key] ?? []), event];
      }
    }

    return { markedDays, blockedRanges, eventsByDate };
  }, [data]);

  const handleDayHover = useCallback((dateKey: string, anchorEl: HTMLElement) => {
    clearTimeout(leaveTimeout.current);
    setHoveredDateKey(dateKey);
    setPopperAnchor(anchorEl);
  }, []);

  const handleDayLeave = useCallback(() => {
    leaveTimeout.current = setTimeout(() => {
      setHoveredDateKey(null);
      setPopperAnchor(null);
    }, 150);
  }, []);

  const hoveredEvents = hoveredDateKey ? (eventsByDate[hoveredDateKey] ?? []) : [];

  return (
    <PageLayout header={<DashboardHeader />}>
      {isLoading ? (
        <Box sx={{ display: 'flex', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
      <Stack display="flex" flexDirection={{xs: 'column', md: 'row'}} gap={2} justifyContent="start">
        <Stack sx={{width: 'fit-content'}} >

          <Calendar
            markedDays={markedDays}
            blockedRanges={blockedRanges}
            showLegend
            onDayHover={handleDayHover}
            onDayLeave={handleDayLeave}
          />

          <Popper
            open={hoveredEvents.length > 0}
            anchorEl={popperAnchor}
            placement="right-start"
            sx={{ zIndex: 1300, maxWidth: 320 }}
            onMouseEnter={() => clearTimeout(leaveTimeout.current)}
            onMouseLeave={handleDayLeave}
          >
            <Stack spacing={1} sx={{ p: 1 }}>
              {hoveredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onEventClick={(id) => console.log('Click en evento:', id)}
                />
              ))}
            </Stack>
          </Popper>

        </Stack>
        <Stack width={{xs: '100%', md: '50%'}}  spacing={2}>
          <Paper elevation={4} sx={{padding:2}}>
          <Typography variant="h4">Próximos eventos</Typography>
          <Stack gap={2}>
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onEventClick={(id) => console.log('Click en evento:', id)}
                />
              ))
            ) : (
              <Typography color="textSecondary">No hay eventos próximos</Typography>
            )}
          </Stack>
          </Paper>
        </Stack>
      </Stack>
      )}
    </PageLayout>
  );
}

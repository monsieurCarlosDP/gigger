import { useEvents, useUpcomingEvents } from '@/features/events/hooks/useEvents';
import type { BlockedRange, DayMark } from '@/shared/components/Calendar';
import { Calendar } from '@/shared/components/Calendar';
import { useDrawerNav } from '@/shared/context/DrawerContext';
import { PageLayout } from '@/shared/layouts/PageLayout';
import { Box, CircularProgress, Paper, Popper, Stack, Typography } from '@mui/material';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useCallback, useMemo, useRef, useState } from 'react';
import { DashboardHeader } from '../components/DashboardHeader';
import { EventCard } from '../components/EventsSummaryCard';

dayjs.locale('es');

export default function DashboardPage() {
  const { data, isLoading } = useEvents();
  const { data: upcomingEvents } = useUpcomingEvents({ limit: 5, type: ['Event', 'Reservation'] });
  const { openDayDrawer, openEventDrawer } = useDrawerNav();

  const [popperAnchor, setPopperAnchor] = useState<HTMLElement | null>(null);
  const [hoveredDateKey, setHoveredDateKey] = useState<string | null>(null);
  const leaveTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  const { markedDays, blockedRanges, eventsByDate } = useMemo(() => {
    const markedDays: Record<string, DayMark[]> = {};
    const blockedRanges: BlockedRange[] = [];
    const eventsByDate: Record<string, NonNullable<typeof data>['data']> = {};

    for (const event of data?.data ?? []) {
      const isCancelled = event.Cancelled === true;

      if (event.Period && event.EndDate) {
        blockedRanges.push({
          start: dayjs(event.StartDate),
          end: dayjs(event.EndDate),
          ...(isCancelled && { color: 'action.disabled' }),
        });
        let cursor = dayjs(event.StartDate);
        const end = dayjs(event.EndDate);
        while (cursor.isBefore(end, 'day') || cursor.isSame(end, 'day')) {
          const k = cursor.format('YYYY-MM-DD');
          eventsByDate[k] = [...(eventsByDate[k] ?? []), event];
          cursor = cursor.add(1, 'day');
        }
      } else {
        const key = dayjs(event.StartDate).format('YYYY-MM-DD');
        markedDays[key] = [...(markedDays[key] ?? []), { color: isCancelled ? 'action.disabled' : 'primary.main' }];
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

  const hoveredEvents = hoveredDateKey
    ? (eventsByDate[hoveredDateKey] ?? []).filter((e) => !e.Cancelled)
    : [];

  const handleDayClick = useCallback((value: Dayjs | null) => {
    if (!value) return;
    const dateKey = value.format('YYYY-MM-DD');
    if (!eventsByDate[dateKey]?.length) return;
    openDayDrawer(dateKey);
  }, [eventsByDate, openDayDrawer]);

  return (
    <PageLayout header={<DashboardHeader />}>
      {isLoading ? (
        <Box sx={{ display: 'flex', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
      <Stack display="flex" flexDirection={{xs: 'column', md: 'row'}} gap={2} justifyContent="start">
        <Stack sx={{ width: 'fit-content', mx: { xs: 'auto', md: 0 } }}>

          <Calendar
            markedDays={markedDays}
            blockedRanges={blockedRanges}
            showLegend
            onChange={handleDayClick}
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
                  onEventClick={() => event.documentId && openEventDrawer(event.documentId)}
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
                  onEventClick={() => event.documentId && openEventDrawer(event.documentId)}
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

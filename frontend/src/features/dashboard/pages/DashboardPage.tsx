import { useEvents } from '@/features/events/hooks/useEvents';
import type { BlockedRange, DayMark } from '@/shared/components/Calendar';
import { Calendar } from '@/shared/components/Calendar';
import { PageLayout } from '@/shared/layouts/PageLayout';
import { Box, CircularProgress, Stack } from '@mui/material';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { DashboardHeader } from '../components/DashboardHeader';

export default function DashboardPage() {
  const { data, isLoading } = useEvents();

  const { markedDays, blockedRanges } = useMemo(() => {
    const markedDays: Record<string, DayMark[]> = {};
    const blockedRanges: BlockedRange[] = [];

    for (const event of data?.data ?? []) {
      if (event.Period && event.EndDate) {
        blockedRanges.push({
          start: dayjs(event.StartDate),
          end: dayjs(event.EndDate),
        });
      } else {
        const key = dayjs(event.StartDate).format('YYYY-MM-DD');
        markedDays[key] = [...(markedDays[key] ?? []), { color: 'primary.main' }];
      }
    }

    return { markedDays, blockedRanges };
  }, [data]);

  return (
    <PageLayout header={<DashboardHeader />}>
      {isLoading ? (
        <Box sx={{ display: 'flex', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
      <Stack display="flex" justifyContent="start">
        <Stack sx={{width: 'fit-content'}} >
          
          <Calendar markedDays={markedDays} blockedRanges={blockedRanges} />

        </Stack>
        <Stack width="50%">

        </Stack>
      </Stack>
      )}
    </PageLayout>
  );
}

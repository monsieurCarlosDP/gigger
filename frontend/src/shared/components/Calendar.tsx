import { Box, Paper, Stack, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import type { PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import type { Dayjs } from 'dayjs';
import type { ComponentType } from 'react';

export interface DayMark {
  /** MUI theme color path or hex, e.g. 'primary.main' | '#ff0000' */
  color: string;
}

export interface BlockedRange {
  start: Dayjs;
  end: Dayjs;
  /** MUI theme color path or hex. Defaults to 'error.main' */
  color?: string;
}

interface MarkedDayProps extends PickersDayProps {
  markedDays?: Record<string, DayMark[]>;
  blockedRanges?: BlockedRange[];
}

function MarkedDay({ day, outsideCurrentMonth, markedDays, blockedRanges, ...props }: MarkedDayProps) {
  const d = day as Dayjs;
  const key = d.format('YYYY-MM-DD');
  const dots = outsideCurrentMonth ? [] : (markedDays?.[key] ?? []);

  const blockedRange = outsideCurrentMonth
    ? undefined
    : blockedRanges?.find(
        (r) =>
          (d.isSame(r.start, 'day') || d.isAfter(r.start, 'day')) &&
          (d.isSame(r.end, 'day') || d.isBefore(r.end, 'day')),
      );

  const isStart = blockedRange != null && d.isSame(blockedRange.start, 'day');
  const isEnd = blockedRange != null && d.isSame(blockedRange.end, 'day');
  const isSingle = isStart && isEnd;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      {blockedRange && (
        <Box
          sx={{
            position: 'absolute',
            top: 2,
            height: 36,
            left: isSingle ? '10%' : isStart ? '50%' : 0,
            right: isSingle ? '10%' : isEnd ? '50%' : 0,
            bgcolor: blockedRange.color ?? 'error.main',
            opacity: 0.2,
            borderRadius: isSingle ? 1 : isStart ? '50% 0 0 50%' : isEnd ? '0 50% 50% 0' : 0,
            pointerEvents: 'none',
          }}
        />
      )}
      <PickersDay {...props} day={day} outsideCurrentMonth={outsideCurrentMonth} />
      {dots.length > 0 && (
        <Box sx={{ display: 'flex', gap: 0.25, mb: 0.5 }}>
          {dots.slice(0, 4).map((dot, i) => (
            <Box key={i} sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: dot.color }} />
          ))}
        </Box>
      )}
    </Box>
  );
}

export interface CalendarProps {
  value?: Dayjs | null;
  onChange?: (value: Dayjs | null) => void;
  markedDays?: Record<string, DayMark[]>;
  blockedRanges?: BlockedRange[];
  showLegend?: boolean;
}

        
const Legend = (<Paper elevation={4}>
          <Stack paddingY={2} paddingX={4} gap={1}>
            <Typography variant="h6">Leyenda</Typography>
            <Stack gap={0.1}>
              <Stack flexDirection="row" alignItems="center" gap={2}>
                <Box key="warning-legen" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: "warning.main" }} />
                <Typography variant="caption">Reserva</Typography>
              </Stack>
              <Stack flexDirection="row" alignItems="center" gap={2}>
                <Box key="success-legen" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: "success.main" }} />
                <Typography variant="caption">Efectivibolo</Typography>
              </Stack>
              <Stack flexDirection="row" alignItems="center" gap={2}>
                <Box key="info-legen" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: "info.main" }} />
                <Typography variant="caption">Efectivibolo + EfectiviDJ</Typography>
              </Stack>
              <Stack flexDirection="row" alignItems="center" gap={2}>
                <Box key="info-legen" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: "error.main" }} />
                <Typography variant="caption" bgcolor="error.main" color="textDisabled">Efectivibolo + EfectiviDJ</Typography>
              </Stack>

            </Stack>
          </Stack>
        </Paper>)

export function Calendar({ value, onChange, markedDays, blockedRanges, showLegend }: CalendarProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack gap={2}>
      <Paper elevation={4}>

      <DateCalendar
        value={value ?? null}
        onChange={onChange}
        slots={{ day: MarkedDay as ComponentType<PickersDayProps> }}
        slotProps={{
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          day: { markedDays, blockedRanges } as any,
        }}
        sx={{
          '& .MuiDayCalendar-slideTransition': { minHeight: 280 },
        }}
        />
        </Paper>
        {showLegend && Legend}
      </Stack>
    </LocalizationProvider>
  );
}

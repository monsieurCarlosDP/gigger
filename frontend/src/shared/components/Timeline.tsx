import type { ReactNode } from 'react';
import { Avatar, Box, Stack, Typography, useTheme } from '@mui/material';

export interface TimelineItem {
  time: string;
  label: string;
  description?: string;
  /** MUI icon element to show inside the avatar */
  icon?: ReactNode;
  /** Avatar background color (defaults to primary.main) */
  color?: string;
  /** Photo URL — if provided, renders a photo avatar instead of an icon */
  photo?: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
  const theme = useTheme();

  return (
    <Stack spacing={0}>
      {items.map((item, index) => {
        const bgColor = item.color ?? theme.palette.primary.main;
        const isLast = index === items.length - 1;

        return (
          <Stack key={index} direction="row" sx={{ minHeight: isLast ? 'auto' : 64 }}>
            {/* Left: time */}
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ width: 48, flexShrink: 0, textAlign: 'right', pt: 0.75 }}
            >
              {item.time}
            </Typography>

            {/* Center: avatar + line */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mx: 1.5 }}>
              <Avatar
                src={item.photo}
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: item.photo ? undefined : bgColor,
                  flexShrink: 0,
                }}
              >
                {!item.photo && item.icon}
              </Avatar>
              {!isLast && (
                <Box
                  sx={{
                    width: 2,
                    flexGrow: 1,
                    bgcolor: 'divider',
                    mt: 0.5,
                  }}
                />
              )}
            </Box>

            {/* Right: content */}
            <Stack sx={{ pb: isLast ? 0 : 2, pt: 0.5 }}>
              <Typography variant="body2" fontWeight={500}>
                {item.label}
              </Typography>
              {item.description && (
                <Typography variant="caption" color="text.secondary">
                  {item.description}
                </Typography>
              )}
            </Stack>
          </Stack>
        );
      })}
    </Stack>
  );
}

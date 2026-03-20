import type { ReactNode } from 'react';
import { Avatar, Box, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import type { LogisticDetails } from '@/shared/utils/logisticUtils';

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
  /** Additional details to show in tooltip on hover */
  details?: LogisticDetails | ReactNode;
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

        const avatarElement = (
          <Avatar
            src={item.photo}
            sx={{
              width: 32,
              height: 32,
              bgcolor: item.photo ? undefined : bgColor,
              flexShrink: 0,
              cursor: item.details ? 'help' : 'default',
            }}
          >
            {!item.photo && item.icon}
          </Avatar>
        );

        return (
          <Stack
            key={index}
            direction="row"
            sx={{
              minHeight: isLast ? 'auto' : 64,
              '&:hover': item.details ? {
                bgcolor: 'action.hover',
                borderRadius: 1,
              } : {},
            }}
          >
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
              {item.details ? (
                <Tooltip
                  title={
                    typeof item.details === 'object' && 'displayName' in item.details ? (
                      // LogisticDetails
                      <Stack spacing={0.5}>
                        {item.details.description && (
                          <Typography variant="body2">{item.details.description}</Typography>
                        )}
                        {item.details.pickupUser && (
                          <Typography variant="caption">
                            👤 Recoger: <strong>{item.details.pickupUser.displayName || item.details.pickupUser.username}</strong>
                          </Typography>
                        )}
                        {item.details.doneByUser && (
                          <Typography variant="caption">
                            👤 Responsable: <strong>{item.details.doneByUser.displayName || item.details.doneByUser.username}</strong>
                          </Typography>
                        )}
                      </Stack>
                    ) : (
                      // ReactNode
                      item.details
                    )
                  }
                  placement="top"
                  arrow
                  enterDelay={200}
                  slotProps={{
                    tooltip: {
                      sx: {
                        bgcolor: '#fff',
                        color: '#000',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                        padding: '12px',
                        fontSize: '0.875rem',
                      },
                    },
                  }}
                >
                  {avatarElement}
                </Tooltip>
              ) : (
                avatarElement
              )}
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

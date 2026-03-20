import type { EventType } from '@/features/events/hooks/useEvents';
import { Chip } from '@mui/material';

const eventTypeConfig: Record<EventType, { label: string; color: 'success' | 'error' }> = {
  Event: { label: 'Evento', color: 'success' },
  Viability: { label: 'Disponibilidad', color: 'error' },
};

type EventChipProps = {
  type: EventType;
};

export function EventChip({ type }: EventChipProps) {
  const config = eventTypeConfig[type];

  return <Chip label={config.label} color={config.color} size="small" />;
}

import type { Meta, StoryObj } from '@storybook/react-vite';
import dayjs from 'dayjs';
import { EventCard } from './EventsSummaryCard';

const meta: Meta<typeof EventCard> = {
  title: 'Features/Dashboard/EventCard',
  component: EventCard,
};

export default meta;
type Story = StoryObj<typeof EventCard>;

export const Default: Story = {
  args: {
    event: {
      id: '1',
      Name: 'Concierto de Rock',
      Description: 'Festival de rock en vivo con múltiples bandas',
      StartDate: dayjs().add(3, 'day').toISOString(),
      Period: false,
    },
    onEventClick: (id) => console.log('Click en evento:', id),
  },
};

export const WithPeriod: Story = {
  args: {
    event: {
      id: '2',
      Name: 'Festival de Jazz',
      Description: 'Tres días de jazz moderno y tradicional',
      StartDate: dayjs().add(15, 'day').toISOString(),
      EndDate: dayjs().add(17, 'day').toISOString(),
      Period: true,
    },
    onEventClick: (id) => console.log('Click:', id),
  },
};

export const TodayEvent: Story = {
  args: {
    event: {
      id: '3',
      Name: 'Evento de hoy',
      Description: 'Sucede hoy mismo',
      StartDate: dayjs().toISOString(),
      Period: false,
    },
    onEventClick: (id) => console.log('Click:', id),
  },
};

export const LongDescription: Story = {
  args: {
    event: {
      id: '4',
      Name: 'Seminario de técnica vocal',
      Description: 'Seminario intensivo de 5 días cubriendo técnicas avanzadas de canto, desde respiración hasta interpretación de diferentes géneros musicales.',
      StartDate: dayjs().add(10, 'day').toISOString(),
      EndDate: dayjs().add(14, 'day').toISOString(),
      Period: true,
    },
    onEventClick: (id) => console.log('Seminario clickeado:', id),
  },
};

export const Cancelled: Story = {
  args: {
    event: {
      id: '5',
      Name: 'Boda García-López',
      Description: 'Ceremonia y banquete cancelados por el cliente',
      StartDate: dayjs().add(20, 'day').toISOString(),
      Type: 'Event',
      Cancelled: true,
      CancelledDate: dayjs().subtract(2, 'day').toISOString(),
    },
    onEventClick: (id) => console.log('Click:', id),
  },
};

export const CancelledPeriod: Story = {
  args: {
    event: {
      id: '6',
      Name: 'Festival de Verano',
      Description: 'Festival cancelado por condiciones meteorológicas',
      StartDate: dayjs().add(30, 'day').toISOString(),
      EndDate: dayjs().add(32, 'day').toISOString(),
      Period: true,
      Type: 'Reservation',
      Cancelled: true,
      CancelledDate: dayjs().subtract(1, 'day').toISOString(),
    },
    onEventClick: (id) => console.log('Click:', id),
  },
};

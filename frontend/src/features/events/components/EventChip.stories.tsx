import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '@mui/material';
import { EventChip } from './EventChip';

const meta: Meta<typeof EventChip> = {
  title: 'Events/EventChip',
  component: EventChip,
};

export default meta;
type Story = StoryObj<typeof EventChip>;

export const Reservation: Story = {
  args: { type: 'Reservation' },
};

export const Event: Story = {
  args: { type: 'Event' },
};

export const Viability: Story = {
  args: { type: 'Viability' },
};

export const AllTypes: Story = {
  render: () => (
    <Stack direction="row" spacing={1}>
      <EventChip type="Reservation" />
      <EventChip type="Event" />
      <EventChip type="Viability" />
    </Stack>
  ),
};

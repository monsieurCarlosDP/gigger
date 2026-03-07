import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Calendar } from './Calendar';

const meta: Meta<typeof Calendar> = {
  title: 'Shared/Calendar',
  component: Calendar,
};

export default meta;
type Story = StoryObj<typeof Calendar>;

const today = dayjs();

export const Default: Story = {};

export const WithDots: Story = {
  render: () => (
    <Calendar
      markedDays={{
        [today.format('YYYY-MM-DD')]: [{ color: 'primary.main' }],
        [today.add(2, 'day').format('YYYY-MM-DD')]: [{ color: 'secondary.main' }, { color: 'success.main' }],
        [today.add(5, 'day').format('YYYY-MM-DD')]: [{ color: 'warning.main' }],
        [today.add(7, 'day').format('YYYY-MM-DD')]: [
          { color: 'primary.main' },
          { color: 'error.main' },
          { color: 'success.main' },
        ],
      }}
    />
  ),
};

export const WithBlockedRange: Story = {
  render: () => (
    <Calendar
      blockedRanges={[
        {
          start: today.add(3, 'day'),
          end: today.add(10, 'day'),
        },
      ]}
    />
  ),
};

export const MultipleBlockedRanges: Story = {
  render: () => (
    <Calendar
      blockedRanges={[
        {
          start: today.add(2, 'day'),
          end: today.add(5, 'day'),
          color: 'error.main',
        },
        {
          start: today.add(15, 'day'),
          end: today.add(20, 'day'),
          color: 'warning.main',
        },
      ]}
    />
  ),
};

export const Combined: Story = {
  render: () => (
    <Calendar
      markedDays={{
        [today.format('YYYY-MM-DD')]: [{ color: 'primary.main' }],
        [today.add(1, 'day').format('YYYY-MM-DD')]: [{ color: 'secondary.main' }, { color: 'success.main' }],
        [today.add(14, 'day').format('YYYY-MM-DD')]: [{ color: 'warning.main' }],
      }}
      blockedRanges={[
        {
          start: today.add(5, 'day'),
          end: today.add(12, 'day'),
        },
      ]}
    />
  ),
};

export const OverlappingRanges: Story = {
  render: () => (
    <Calendar
      blockedRanges={[
        {
          start: today.add(3, 'day'),
          end: today.add(10, 'day'),
          color: 'error.main',
        },
        {
          start: today.add(7, 'day'),
          end: today.add(15, 'day'),
          color: 'warning.main',
        },
        {
          start: today.add(12, 'day'),
          end: today.add(14, 'day'),
          color: 'info.main',
        },
      ]}
    />
  ),
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<Dayjs | null>(null);
    return (
      <Calendar
        value={value}
        onChange={setValue}
        markedDays={{
          [today.format('YYYY-MM-DD')]: [{ color: 'primary.main' }],
          [today.add(3, 'day').format('YYYY-MM-DD')]: [{ color: 'error.main' }],
        }}
        blockedRanges={[
          {
            start: today.add(8, 'day'),
            end: today.add(14, 'day'),
          },
        ]}
      />
    );
  },
};

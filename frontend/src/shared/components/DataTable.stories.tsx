import type { Meta, StoryObj } from '@storybook/react';
import { Chip, Typography } from '@mui/material';
import { DataTable } from './DataTable';
import type { ColumnDef } from './DataTable';

interface Person {
  id: number;
  name: string;
  role: string;
  email: string;
  active: boolean;
}

const people: Person[] = [
  { id: 1, name: 'Ana García', role: 'DJ', email: 'ana@example.com', active: true },
  { id: 2, name: 'Carlos López', role: 'Técnico', email: 'carlos@example.com', active: true },
  { id: 3, name: 'María Fernández', role: 'Manager', email: 'maria@example.com', active: false },
  { id: 4, name: 'Pedro Martínez', role: 'DJ', email: 'pedro@example.com', active: true },
];

const columns: ColumnDef<Person>[] = [
  {
    key: 'name',
    header: 'Nombre',
    render: (row) => <Typography variant="body2" fontWeight={500}>{row.name}</Typography>,
  },
  {
    key: 'role',
    header: 'Rol',
    render: (row) => <Typography variant="body2">{row.role}</Typography>,
  },
  {
    key: 'email',
    header: 'Email',
    render: (row) => <Typography variant="body2" color="text.secondary">{row.email}</Typography>,
  },
  {
    key: 'active',
    header: 'Estado',
    align: 'center',
    render: (row) => (
      <Chip
        label={row.active ? 'Activo' : 'Inactivo'}
        size="small"
        color={row.active ? 'success' : 'default'}
      />
    ),
  },
];

const meta: Meta<typeof DataTable<Person>> = {
  title: 'Shared/DataTable',
  component: DataTable,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    columns,
    rows: people,
    getRowKey: (row) => row.id,
  },
};

export const WithRowClick: Story = {
  args: {
    columns,
    rows: people,
    getRowKey: (row) => row.id,
    onRowClick: (row) => alert(`Clicked: ${row.name}`),
  },
};

export const Loading: Story = {
  args: {
    columns,
    rows: [],
    getRowKey: (row) => row.id,
    isLoading: true,
  },
};

export const Empty: Story = {
  args: {
    columns,
    rows: [],
    getRowKey: (row) => row.id,
    emptyMessage: 'No hay personas registradas',
  },
};

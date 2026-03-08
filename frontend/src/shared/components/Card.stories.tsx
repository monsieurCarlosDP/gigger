import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Card from './Card';

const meta: Meta<typeof Card> = {
  title: 'Shared/Card',
  component: Card,
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    headerContent: 'Título de la tarjeta',
    cardContent: 'Este es el contenido principal de la tarjeta con información relevante.',
    cardMainAction: () => console.log('Tarjeta clickeada'),
    cardActions: undefined,
  },
};

export const WithActions: Story = {
  args: {
    headerContent: 'Evento próximo',
    cardContent: 'Concierto de Rock - 15 de Marzo',
    cardMainAction: () => console.log('Ver evento'),
    cardActions: (
      <Stack direction="row" spacing={1}>
        <Button size="small" startIcon={<EditIcon />}>
          Editar
        </Button>
        <Button size="small" startIcon={<DeleteIcon />} color="error">
          Eliminar
        </Button>
      </Stack>
    ),
  },
};

export const Empty: Story = {
  args: {
    headerContent: undefined,
    cardContent: undefined,
    cardMainAction: () => console.log('Acción'),
    cardActions: undefined,
  },
};

export const OnlyHeader: Story = {
  args: {
    headerContent: 'Solo encabezado',
    cardContent: undefined,
    cardMainAction: () => alert('Clickeaste el header'),
    cardActions: undefined,
  },
};

export const OnlyContent: Story = {
  args: {
    headerContent: undefined,
    cardContent: 'Solo contenido sin encabezado',
    cardMainAction: () => console.log('Contenido clickeado'),
    cardActions: undefined,
  },
};

export const Complete: Story = {
  args: {
    headerContent: 'Concierto de verano',
    cardContent: 'Festival de música en vivo con múltiples artistas. Fecha: 25 de Julio. Ubicación: Parque Central.',
    cardMainAction: () => console.log('Abriendo detalles del evento'),
    cardActions: (
      <Stack direction="row" spacing={1}>
        <Button size="small" variant="contained" color="primary">
          Reservar
        </Button>
        <Button size="small" variant="outlined">
          Compartir
        </Button>
      </Stack>
    ),
  },
};

export const LongContent: Story = {
  args: {
    headerContent: 'Jazz Night',
    cardContent:
      'Un evento exclusivo que trae lo mejor del jazz moderno a la ciudad. Disfruta de actuaciones en vivo de artistas reconocidos internacionalmente. La entrada incluye una bebida de cortesía y acceso al área VIP.',
    cardMainAction: () => console.log('Ver más detalles'),
    cardActions: (
      <Button size="small" fullWidth variant="contained">
        Comprar entradas
      </Button>
    ),
  },
};

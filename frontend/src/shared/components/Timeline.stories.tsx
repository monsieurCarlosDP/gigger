import BuildIcon from '@mui/icons-material/Build';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import FlagIcon from '@mui/icons-material/Flag';
import HomeIcon from '@mui/icons-material/Home';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import NightlightIcon from '@mui/icons-material/Nightlight';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import type { Meta, StoryObj } from '@storybook/react';
import { Timeline } from './Timeline';

const meta: Meta<typeof Timeline> = {
  title: 'Shared/Timeline',
  component: Timeline,
};

export default meta;
type Story = StoryObj<typeof Timeline>;

export const Default: Story = {
  args: {
    items: [
      { time: '08:00', label: 'Carga de equipo', description: 'Almacén central', icon: <Inventory2Icon sx={{ fontSize: 18 }} />, color: '#546e7a' },
      { time: '08:45', label: 'Recoger a Carlos', description: 'C/ Gran Vía 12', photo: 'https://i.pravatar.cc/150?u=carlos' },
      { time: '09:30', label: 'Salida', description: 'Viaje estimado: 2h 15min', icon: <DirectionsCarIcon sx={{ fontSize: 18 }} />, color: '#1565c0' },
      { time: '10:15', label: 'Recoger a Laura', description: 'Estación Atocha', photo: 'https://i.pravatar.cc/150?u=laura' },
      { time: '11:45', label: 'Llegada y montaje', description: 'Recinto ferial, puerta B', icon: <BuildIcon sx={{ fontSize: 18 }} />, color: '#ef6c00' },
      { time: '14:00', label: 'Inicio del evento', icon: <MusicNoteIcon sx={{ fontSize: 18 }} />, color: '#2e7d32' },
      { time: '22:00', label: 'Fin del evento', icon: <FlagIcon sx={{ fontSize: 18 }} />, color: '#2e7d32' },
      { time: '22:30', label: 'Desmontaje', icon: <BuildIcon sx={{ fontSize: 18 }} />, color: '#ef6c00' },
      { time: '23:30', label: 'Salida de vuelta', icon: <DirectionsCarIcon sx={{ fontSize: 18 }} />, color: '#1565c0' },
      { time: '01:30', label: 'Llegada a casa', icon: <NightlightIcon sx={{ fontSize: 18 }} />, color: '#37474f' },
    ],
  },
};

export const WithPickups: Story = {
  args: {
    items: [
      { time: '09:00', label: 'Salida desde casa', icon: <HomeIcon sx={{ fontSize: 18 }} />, color: '#546e7a' },
      { time: '09:20', label: 'Recoger a Marta', description: 'Plaza España', photo: 'https://i.pravatar.cc/150?u=marta' },
      { time: '09:45', label: 'Recoger a Javi', description: 'Av. de la Constitución 5', photo: 'https://i.pravatar.cc/150?u=javi' },
      { time: '10:30', label: 'Llegada al venue', icon: <PersonPinIcon sx={{ fontSize: 18 }} />, color: '#1565c0' },
    ],
  },
};

export const Minimal: Story = {
  args: {
    items: [
      { time: '10:00', label: 'Llegada', icon: <DirectionsCarIcon sx={{ fontSize: 18 }} />, color: '#1565c0' },
      { time: '18:00', label: 'Fin', icon: <FlagIcon sx={{ fontSize: 18 }} />, color: '#2e7d32' },
    ],
  },
};

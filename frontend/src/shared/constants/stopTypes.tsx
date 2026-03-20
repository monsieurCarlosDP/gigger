import type { ReactNode } from 'react';
import BuildIcon from '@mui/icons-material/Build';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import FlagIcon from '@mui/icons-material/Flag';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import NightlightIcon from '@mui/icons-material/Nightlight';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import UnarchiveIcon from '@mui/icons-material/Unarchive';

export interface StopTypeConfig {
  value: string;
  label: string;
  icon: ReactNode;
  color: string;
}

const iconSx = { fontSize: 18 };

export const STOP_TYPES: StopTypeConfig[] = [
  { value: 'load', label: 'Carga', icon: <Inventory2Icon sx={iconSx} />, color: '#546e7a' },
  { value: 'unload', label: 'Descarga', icon: <UnarchiveIcon sx={iconSx} />, color: '#546e7a' },
  { value: 'pickup', label: 'Recogida', icon: <PersonPinIcon sx={iconSx} />, color: '#1565c0' },
  { value: 'setup', label: 'Montaje', icon: <BuildIcon sx={iconSx} />, color: '#ef6c00' },
  { value: 'teardown', label: 'Desmontaje', icon: <BuildIcon sx={iconSx} />, color: '#ef6c00' },
  { value: 'event_start', label: 'Inicio del evento', icon: <MusicNoteIcon sx={iconSx} />, color: '#2e7d32' },
  { value: 'event_end', label: 'Fin del evento', icon: <FlagIcon sx={iconSx} />, color: '#2e7d32' },
  { value: 'departure', label: 'Salida', icon: <FlightTakeoffIcon sx={iconSx} />, color: '#1565c0' },
  { value: 'arrival', label: 'Llegada', icon: <FlightLandIcon sx={iconSx} />, color: '#1565c0' },
  { value: 'meal', label: 'Comida', icon: <RestaurantIcon sx={iconSx} />, color: '#8d6e63' },
  { value: 'rest', label: 'Descanso', icon: <EventAvailableIcon sx={iconSx} />, color: '#7b1fa2' },
  { value: 'pick_truck', label: 'Recoger camión', icon: <LocalShippingIcon sx={iconSx} />, color: '#d32f2f' },
  { value: 'leave_truck', label: 'Devolver camión', icon: <LocalShippingIcon sx={iconSx} />, color: '#d32f2f' },
];

export const STOP_TYPE_MAP = Object.fromEntries(STOP_TYPES.map((t) => [t.value, t])) as Record<string, StopTypeConfig>;

export const DEFAULT_STOP_ICON = <NightlightIcon sx={iconSx} />;
export const DEFAULT_STOP_COLOR = '#78909c';

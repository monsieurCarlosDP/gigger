import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface FloatingActionMenuProps {
  isDrawerOpen?: boolean;
}

export function FloatingActionMenu({ isDrawerOpen = false }: FloatingActionMenuProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const actions = [
    {
      icon: <EventIcon />,
      name: 'Nuevo Evento',
      action: () => {
        navigate('/events/new');
        handleClose();
      },
    },
    {
      icon: <PersonIcon />,
      name: 'Nuevo Contacto',
      action: () => {
        navigate('/people/new');
        handleClose();
      },
    },
    {
      icon: <SettingsIcon />,
      name: 'Configuración',
      action: () => {
        navigate('/profile');
        handleClose();
      },
    },
    {
      icon: <HelpIcon />,
      name: 'Ayuda',
      action: () => {
        console.log('TODO: Abrir ayuda');
        handleClose();
      },
    },
  ];

  return (
    <SpeedDial
      ariaLabel="Menu de acciones flotante"
      sx={{
        position: 'fixed',
        bottom: { xs: 16, sm: 32 },
        right: { xs: 16, sm: 32 },
        zIndex: isDrawerOpen ? 900 : 1000,
        opacity: isDrawerOpen ? 0 : 1,
        pointerEvents: isDrawerOpen ? 'none' : 'auto',
        transition: 'all 0.3s ease-in-out',
      }}
      icon={<SpeedDialIcon />}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={action.action}
        />
      ))}
    </SpeedDial>
  );
}

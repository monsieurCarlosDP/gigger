import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import { UserAvatar } from '@/shared/components/UserAvatar';
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer as MuiDrawer,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/shared/context/AuthContext';

const EXPANDED_WIDTH = 240;
const COLLAPSED_WIDTH = 64;

interface NavItem {
  label: string;
  subtitle?: string;
  icon: React.ReactNode;
  path: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', subtitle: 'Vista general', icon: <DashboardIcon />, path: '/' },
  { label: 'Eventos', subtitle: 'Gestión de eventos', icon: <EventIcon />, path: '/events' },
  { label: 'Personas', subtitle: 'Contactos', icon: <PeopleIcon />, path: '/people' },
  { label: 'Tarifas', subtitle: 'Precios y distancias', icon: <AttachMoneyIcon />, path: '/tariffs' },
];

interface NavbarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

function NavContent({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header: Avatar / User info */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          p: 1.5,
          justifyContent: collapsed ? 'center' : 'initial',
          cursor: 'pointer',
          '&:hover': { bgcolor: 'action.hover' },
          borderRadius: 1,
        }}
        onClick={() => navigate('/profile')}
      >
        <UserAvatar avatar={user?.avatar} size={32} />
        {!collapsed && (
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="body2" fontWeight={500} noWrap>
              {user?.displayName ?? user?.username ?? 'Usuario'}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user?.email ?? ''}
            </Typography>
          </Box>
        )}
      </Box>

      <Divider />

      {/* Nav items */}
      <List sx={{ flexGrow: 1, px: collapsed ? 0.5 : 1, pt: 1 }}>
        {navItems.map((item) => {
          const selected = location.pathname === item.path;

          const button = (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                selected={selected}
                onClick={() => navigate(item.path)}
                sx={{
                  minHeight: 48,
                  justifyContent:  'initial',
                  borderRadius: 1,
                  mb: 0.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: collapsed ? 0 : 2,
                    justifyContent: 'flex-start',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={item.label}
                    secondary={item.subtitle}
                    sx={{ overflow: 'hidden' }}
                    slotProps={{
                      primary: { variant: 'body2', fontWeight: 500, noWrap: true },
                      secondary: { variant: 'caption', noWrap: true },
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );

          return collapsed ? (
            <Tooltip key={item.path} title={item.label} placement="right">
              {button}
            </Tooltip>
          ) : (
            button
          );
        })}
      </List>

      {/* Footer: Toggle + Logout */}
      <Divider />
      <Stack sx={{ px: collapsed ? 0.5 : 1, py: 1, justifyContent: collapsed ? 'center': 'initial' }}>
        {collapsed ? (
          <>
            <Tooltip title="Expandir menú" placement="right">
              <IconButton onClick={onToggle} size="small" sx={{ mb: 0.5, ml: 0.5,minHeight: 48, justifyContent: 'flex-start'}}>
                <MenuIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cerrar sesión" placement="right">
              <IconButton size="small" onClick={logout} sx={{minHeight: 48, ml: 0.5, justifyContent: 'flex-start'}}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <>
            <ListItemButton
              sx={{ borderRadius: 1, minHeight: 48}}
              onClick={onToggle}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: 2, justifyContent: 'initial' }}>
                <ChevronLeftIcon />
              </ListItemIcon>
              <ListItemText
                primary="Colapsar menú"
                sx={{ overflow: 'hidden' }}
                slotProps={{ primary: { variant: 'body2', noWrap: true } }}
              />
            </ListItemButton>
            <ListItemButton
              sx={{ borderRadius: 1, minHeight: 48 }}
              onClick={logout}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: 2, justifyContent: 'initial' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary="Cerrar sesión"
                sx={{ overflow: 'hidden' }}
                slotProps={{ primary: { variant: 'body2', noWrap: true } }}
              />
            </ListItemButton>
          </>
        )}
      </Stack>
    </Box>
  );
}

export function Navbar({ collapsed, onToggle, mobileOpen, onMobileClose }: NavbarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (isMobile) {
    return (
      <MuiDrawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: EXPANDED_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        <NavContent collapsed={false} onToggle={onMobileClose} />
      </MuiDrawer>
    );
  }

  return (
    <MuiDrawer
      variant="permanent"
      sx={{
        width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
          boxSizing: 'border-box',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
        },
      }}
    >
      <NavContent collapsed={collapsed} onToggle={onToggle} />
    </MuiDrawer>
  );
}

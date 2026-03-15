import { Suspense, useState } from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Drawer, IconButton, useMediaQuery, useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { useDrawerNav } from '../context/DrawerContext';
import { Navbar } from '../components/Navbar';
import { DayEventsDrawerView } from './DayEventsDrawerView';
import { EventBudgetsDrawerView } from './EventBudgetsDrawerView';
import { EventDetailDrawerView } from './EventDetailDrawerView';

const RIGHT_DRAWER_WIDTH = { xs: '100%', sm: 480 };

export default function MainLayout() {
  const [searchParams] = useSearchParams();
  const { closeDrawer } = useDrawerNav();
  const navigate = useNavigate();
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const drawerType = searchParams.get('drawer');
  const isOpen = !!drawerType;

  let drawerContent = null;
  if (drawerType === 'day') {
    const date = searchParams.get('date') ?? '';
    drawerContent = <DayEventsDrawerView date={date} />;
  } else if (drawerType === 'event') {
    const id = searchParams.get('id') ?? '';
    drawerContent = <EventDetailDrawerView id={id} />;
  } else if (drawerType === 'budgets') {
    const id = searchParams.get('id') ?? '';
    drawerContent = <EventBudgetsDrawerView eventId={id} />;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Navbar
        collapsed={navCollapsed}
        onToggle={() => setNavCollapsed((prev) => !prev)}
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
        }}
      >
        {isMobile && (
          <Box sx={{ p: 1 }}>
            <IconButton onClick={() => setMobileNavOpen(true)} size="small">
              <MenuIcon />
            </IconButton>
          </Box>
        )}

        <Suspense
          fallback={
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              <CircularProgress />
            </Box>
          }
        >
          <Outlet />
        </Suspense>
      </Box>

      <Drawer
        anchor="right"
        open={isOpen}
        onClose={closeDrawer}
        variant="temporary"
        sx={{
          '& .MuiDrawer-paper': {
            width: RIGHT_DRAWER_WIDTH,
            boxSizing: 'border-box',
            height: '100%',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1 }}>
          <IconButton onClick={() => navigate(-1)} size="small">
            <ArrowBackIcon />
          </IconButton>
          <IconButton onClick={closeDrawer} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ px: 3, pb: 3, flexGrow: 1, overflowY: 'auto' }}>
          {drawerContent}
        </Box>
      </Drawer>
    </Box>
  );
}

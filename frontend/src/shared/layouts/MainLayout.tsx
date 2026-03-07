import { Suspense, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CircularProgress, Drawer, IconButton, useMediaQuery, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { DrawerProvider, useDrawerState, useDrawerActions } from '../context/DrawerContext';
import { Navbar } from '../components/Navbar';

const RIGHT_DRAWER_WIDTH = { xs: '100%', sm: 480 };

function LayoutContent() {
  const { isOpen, content } = useDrawerState();
  const { closeDrawer } = useDrawerActions();
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={closeDrawer} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ px: 3, pb: 3, flexGrow: 1, overflowY: 'auto' }}>
          {content}
        </Box>
      </Drawer>
    </Box>
  );
}

export default function MainLayout() {
  return (
    <DrawerProvider>
      <LayoutContent />
    </DrawerProvider>
  );
}

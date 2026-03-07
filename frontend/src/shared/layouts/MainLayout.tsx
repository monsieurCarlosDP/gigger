import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CircularProgress, Drawer, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DrawerProvider, useDrawerState, useDrawerActions } from '../context/DrawerContext';

const DRAWER_WIDTH = { xs: '100%', sm: 480 };

function LayoutContent() {
  const { isOpen, content } = useDrawerState();
  const { closeDrawer } = useDrawerActions();

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Box
        component="main"
        sx={{
          minHeight: '100vh',
        }}
      >
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
            width: DRAWER_WIDTH,
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

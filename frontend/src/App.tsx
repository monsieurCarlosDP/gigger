import { Box, CircularProgress } from '@mui/material';
import { lazy } from 'react';
import { BrowserRouter, Navigate, Outlet, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/shared/context/AuthContext';
import { SnackbarProvider } from '@/shared/context/SnackbarContext';

const MainLayout = lazy(() => import('@/shared/layouts/MainLayout'));
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const EventsPage = lazy(() => import('@/features/events/pages/EventsPage'));
const EventDetailPage = lazy(() => import('@/features/events/pages/EventDetailPage'));
const ProfilePage = lazy(() => import('@/features/auth/pages/ProfilePage'));

function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <SnackbarProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="events" element={<EventsPage />} />
                <Route path="events/:documentId" element={<EventDetailPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </SnackbarProvider>
  );
}

import { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SnackbarProvider } from '@/shared/context/SnackbarContext';

const MainLayout = lazy(() => import('@/shared/layouts/MainLayout'));
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const EventsPage = lazy(() => import('@/features/events/pages/EventsPage'));
const EventDetailPage = lazy(() => import('@/features/events/pages/EventDetailPage'));

export default function App() {
  return (
    <SnackbarProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="events/:documentId" element={<EventDetailPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SnackbarProvider>
  );
}

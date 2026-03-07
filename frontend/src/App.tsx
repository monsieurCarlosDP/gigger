import { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const MainLayout = lazy(() => import('@/shared/layouts/MainLayout'));
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

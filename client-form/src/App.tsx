import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { Container, CircularProgress, Box, ThemeProvider } from '@mui/material'
import theme from '@/shared/theme'

const EventRequestFormPage = lazy(() => import('@/features/event-request/pages/EventRequestFormPage'))
const FollowUpPage = lazy(() => import('@/features/follow-up/pages/FollowUpPage'))

function LoadingFallback() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <CircularProgress sx={{ color: '#C847FF' }} />
    </Box>
  )
}

function RootRedirect() {
  const savedId = localStorage.getItem('gigger_event_id')
  if (savedId) return <Navigate to={`/follow-up/${savedId}`} replace />
  return <EventRequestFormPage />
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Container maxWidth="md">
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route index element={<RootRedirect />} />
                <Route path="follow-up/:id" element={<FollowUpPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </Container>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  )
}

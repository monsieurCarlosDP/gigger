import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { Container, CircularProgress, Box, ThemeProvider } from '@mui/material'
import theme from '@/shared/theme'

const EventRequestFormPage = lazy(() => import('@/features/event-request/pages/EventRequestFormPage'))

function LoadingFallback() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <CircularProgress sx={{ color: '#C847FF' }} />
    </Box>
  )
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Container maxWidth="md">
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route index element={<EventRequestFormPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </Container>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  )
}

import { Box, Stack } from '@mui/material';
import type { ReactNode } from 'react';

interface PageLayoutProps {
  header?: ReactNode;
  children: ReactNode;
}

export function PageLayout({ header, children }: PageLayoutProps) {
  return (
    <Stack sx={{ minHeight: '100vh' }}>
      {header && (
        <Box
          component="header"
          sx={{
            px: { xs: 2, sm: 3 },
            py: 2,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          {header}
        </Box>
      )}
      <Box
        component="section"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
        }}
      >
        {children}
      </Box>
    </Stack>
  );
}

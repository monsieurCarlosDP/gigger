import { Stack } from '@mui/material';
import type { ReactNode } from 'react';

interface PageLayoutProps {
  header?: ReactNode;
  children: ReactNode;
}

export function PageLayout({ header, children }: PageLayoutProps) {
  return (
    <Stack sx={{ minHeight: '100vh' }}>
      {header && (
        <Stack
          component="header"
          sx={{
            px: { xs: 2, sm: 3 },
            py: 2,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          {header}
        </Stack>
      )}
      <Stack
        component="section"
        justifyContent="start"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
        }}
      >
        {children}
      </Stack>
    </Stack>
  );
}

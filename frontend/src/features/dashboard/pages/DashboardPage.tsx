import { Button, Paper, Typography } from '@mui/material';
import { useDrawerActions } from '@/shared/context/DrawerContext';
import { PageLayout } from '@/shared/layouts/PageLayout';
import { DashboardHeader } from '../components/DashboardHeader';

export default function DashboardPage() {
  const { openDrawer } = useDrawerActions();

  return (
    <PageLayout header={<DashboardHeader />}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Bienvenido a Gigger. El contenido del dashboard aparecerá aquí.
        </Typography>
        <Button
          variant="outlined"
          onClick={() =>
            openDrawer(
              <Typography variant="body1">
                Contenido de ejemplo del drawer.
              </Typography>,
            )
          }
        >
          Abrir drawer
        </Button>
      </Paper>
    </PageLayout>
  );
}

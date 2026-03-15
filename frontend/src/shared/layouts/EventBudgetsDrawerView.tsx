import { useAcceptBudget, useEventById } from '@/features/events/hooks/useEvents';
import CheckIcon from '@mui/icons-material/Check';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material';

interface EventBudgetsDrawerViewProps {
  eventId: string;
}

export function EventBudgetsDrawerView({ eventId }: EventBudgetsDrawerViewProps) {
  const { data, isLoading } = useEventById(eventId, {
    query: { populate: ['Budget'] },
  });
  const { mutate: acceptBudget, isPending } = useAcceptBudget();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const event = data?.data;
  if (!event) {
    return <Typography color="textSecondary">Evento no encontrado</Typography>;
  }

  const budgets = event.Budget ?? [];

  return (
    <Stack spacing={3}>
      <Stack spacing={0.5}>
        <Typography variant="h6">Presupuestos</Typography>
        <Typography variant="body2" color="text.secondary">{event.Name}</Typography>
      </Stack>

      {budgets.length === 0 ? (
        <Typography color="textSecondary">Sin presupuestos</Typography>
      ) : (
        <Stack spacing={2}>
          {budgets.map((budget, index) => {
            const total = (budget.Base ?? 0) + (budget.Dietas ?? 0);
            const isAccepted = budget.Accepted === true;
            const hasExtras = budget.Equipment || budget.DJ;

            return (
              <Card
                key={index}
                variant="outlined"
                sx={{
                  borderColor: isAccepted ? 'success.main' : 'divider',
                  bgcolor: isAccepted ? 'success.50' : 'background.paper',
                }}
              >
                <CardContent>
                  <Stack spacing={1.5}>

                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography variant="subtitle1" fontWeight={600}>
                        Presupuesto {index + 1}
                      </Typography>
                      {isAccepted && (
                        <Chip icon={<CheckIcon />} label="Aceptado" size="small" color="success" />
                      )}
                    </Stack>

                    <Divider />

                    <Stack spacing={0.75}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">Base</Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {budget.Base != null ? `${budget.Base} €` : '—'}
                        </Typography>
                      </Stack>

                      {budget.Dietas != null && (
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">Dietas</Typography>
                          <Typography variant="body2" fontWeight={500}>{budget.Dietas} €</Typography>
                        </Stack>
                      )}

                      {budget.Dietas != null && budget.Base != null && (
                        <>
                          <Divider />
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" fontWeight={600}>Total</Typography>
                            <Typography variant="body2" fontWeight={600}>{total} €</Typography>
                          </Stack>
                        </>
                      )}
                    </Stack>

                    {hasExtras && (
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {budget.Equipment && (
                          <Chip label="Equipo incluido" size="small" variant="outlined" />
                        )}
                        {budget.DJ && (
                          <Chip label="DJ incluido" size="small" variant="outlined" />
                        )}
                      </Stack>
                    )}

                    {!isAccepted && (
                      <Button
                        variant="contained"
                        size="small"
                        fullWidth
                        disabled={isPending}
                        onClick={() => acceptBudget({ eventId, budgetIndex: index, budgets })}
                      >
                        Aceptar presupuesto
                      </Button>
                    )}

                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
}

import { useAcceptBudget, useEventById } from '@/features/events/hooks/useEvents';
import { usePrice } from '@/features/tariffs/hooks/usePrice';
import CheckIcon from '@mui/icons-material/Check';
import ShareIcon from '@mui/icons-material/Share';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Popper,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';

interface EventBudgetsDrawerViewProps {
  eventId: string;
}

export function EventBudgetsDrawerView({ eventId }: EventBudgetsDrawerViewProps) {
  const { data, isLoading } = useEventById(eventId, {
    query: { populate: ['Budget'] },
  });
  const { mutate: acceptBudget, isPending } = useAcceptBudget();
  const price = usePrice();
  const [openPopper, setOpenPopper] = useState<{ [key: number]: HTMLButtonElement | null }>({});

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
            const total = (budget.Base ?? 0) + (budget.Dietas ?? 0) + (budget.DJ ? price.dj : 0) + (budget.Equipment ? price.equipment : 0);
            const isAccepted = budget.Accepted === true;
            const anchorEl = openPopper[index] ?? null;
            const open = Boolean(anchorEl);

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
                      <Stack direction="row" alignItems="center" spacing={1}>
                        {isAccepted && (
                          <Chip icon={<CheckIcon />} label="Aceptado" size="small" color="success" />
                        )}
                        <IconButton
                          size="small"
                          onClick={(e) => setOpenPopper({ ...openPopper, [index]: e.currentTarget })}
                          title="Compartir presupuesto"
                        >
                          <ShareIcon fontSize="small" />
                        </IconButton>
                        <Popper open={open} anchorEl={anchorEl} placement="bottom-end">
                          <Paper sx={{ p: 1, mt: 1 }}>
                            <Stack spacing={0.5}>
                              <Typography variant="caption" sx={{ px: 1, display: 'block', color: 'text.secondary' }}>
                                Compartir como:
                              </Typography>
                              <Button size="small" fullWidth sx={{ justifyContent: 'flex-start' }}>
                                📧 Email
                              </Button>
                              <Button size="small" fullWidth sx={{ justifyContent: 'flex-start' }}>
                                🔗 Copiar enlace
                              </Button>
                            </Stack>
                          </Paper>
                        </Popper>
                      </Stack>
                    </Stack>

                    <Divider />

                    <Stack spacing={0.75}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">🎸 Efectivishow</Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {budget.Base != null ? `${budget.Base} €` : '—'}
                        </Typography>
                      </Stack>

                      {budget.Dietas != null && (
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">🚐 Dietas y transporte</Typography>
                          <Typography variant="body2" fontWeight={500}>{budget.Dietas} €</Typography>
                        </Stack>
                      )}

                      {budget.DJ && (
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">🎧 EfectiviDJs</Typography>
                          <Typography variant="body2" fontWeight={500}>{price.dj} €</Typography>
                        </Stack>
                      )}

                      {budget.Equipment && (
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">🔊 Equipo</Typography>
                          <Typography variant="body2" fontWeight={500}>{price.equipment} €</Typography>
                        </Stack>
                      )}

                      <Divider />
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" fontWeight={600}>Total</Typography>
                        <Typography variant="body2" fontWeight={600}>{total} €</Typography>
                      </Stack>
                    </Stack>

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

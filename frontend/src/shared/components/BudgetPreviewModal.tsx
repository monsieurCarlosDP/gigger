import type { BudgetItem } from '@/features/events/hooks/useEventForm';
import { usePrice } from '@/features/tariffs/hooks/usePrice';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
import {
  Backdrop,
  Box,
  Chip,
  Divider,
  Fade,
  IconButton,
  Modal,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

interface EventSummary {
  Name: string;
  Location?: string;
  StartDate?: string;
  GigType?: string;
  Distance?: number | string | null;
}

interface BudgetPreviewModalProps {
  open: boolean;
  onClose: () => void;
  event: EventSummary;
  budget: BudgetItem;
  budgetIndex: number;
}

export function BudgetPreviewModal({ open, onClose, event, budget, budgetIndex }: BudgetPreviewModalProps) {
  const price = usePrice();
  const total = (budget.Base ?? 0) + (budget.Dietas ?? 0) + (budget.DJ ? price.dj : 0) + (budget.Equipment ? price.equipment : 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 300 } }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            /* A4 aspect ratio scaled to viewport */
            width: { xs: '90vw', sm: '50vh' },
            height: { xs: 'auto', sm: '70vh' },
            maxWidth: 520,
          }}
        >
          {/* Toolbar — hidden when printing */}
          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={1}
            sx={{ mb: 1, '@media print': { display: 'none' } }}
          >
            <IconButton onClick={handlePrint} sx={{ color: 'white' }}>
              <PrintIcon />
            </IconButton>
            <IconButton onClick={onClose} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Stack>

          {/* Printable content */}
          <Paper
            elevation={6}
            sx={{
              p: 5,
              height: '100%',
              fontSize: '0.75rem',
              '@media print': {
                boxShadow: 'none',
                p: 0,
              },
            }}
          >
            <Stack spacing={2.5}>
              {/* Header */}
              <Stack spacing={0.5}>
                <Typography fontSize="1.1rem" fontWeight={700}>
                  Presupuesto {budgetIndex + 1}
                </Typography>
                <Typography fontSize="0.9rem" color="text.secondary">
                  {event.Name}
                </Typography>
              </Stack>

              <Divider />

              {/* Event info */}
              <Stack spacing={0.75}>
                {event.StartDate && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography fontSize="0.75rem" color="text.secondary">Fecha</Typography>
                    <Typography fontSize="0.75rem">
                      {new Date(event.StartDate).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Typography>
                  </Stack>
                )}
                {event.Location && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography fontSize="0.75rem" color="text.secondary">Ubicación</Typography>
                    <Typography fontSize="0.75rem">{event.Location}</Typography>
                  </Stack>
                )}
                {event.Distance != null && Number(event.Distance) > 0 && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography fontSize="0.75rem" color="text.secondary">Distancia</Typography>
                    <Typography fontSize="0.75rem">{event.Distance} km</Typography>
                  </Stack>
                )}
              </Stack>

              <Divider />

              {/* Budget breakdown */}
              <Stack spacing={1}>
                <Typography fontSize="0.85rem" fontWeight={600}>Desglose</Typography>

                {budget.Base != null && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography fontSize="0.8rem">🎸 Efectivishow</Typography>
                    <Typography fontSize="0.8rem" fontWeight={500}>{budget.Base} €</Typography>
                  </Stack>
                )}

                {budget.Dietas != null && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography fontSize="0.8rem">🚐 Dietas y transporte</Typography>
                    <Typography fontSize="0.8rem" fontWeight={500}>{budget.Dietas} €</Typography>
                  </Stack>
                )}

                {budget.DJ && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography fontSize="0.8rem">🎧 EfectiviDJs</Typography>
                    <Typography fontSize="0.8rem" fontWeight={500}>{price.dj} €</Typography>
                  </Stack>
                )}

                {budget.Equipment && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography fontSize="0.8rem">🔊 Equipo</Typography>
                    <Typography fontSize="0.8rem" fontWeight={500}>{price.equipment} €</Typography>
                  </Stack>
                )}

                <Divider />
                <Stack direction="row" justifyContent="space-between">
                  <Typography fontSize="1rem" fontWeight={700}>Total</Typography>
                  <Typography fontSize="1rem" fontWeight={700}>{total} €</Typography>
                </Stack>

                {budget.Accepted && (
                  <Chip label="Presupuesto aceptado" color="success" size="small" sx={{ alignSelf: 'flex-start' }} />
                )}
              </Stack>
            </Stack>
          </Paper>
        </Box>
      </Fade>
    </Modal>
  );
}

import { BudgetActionButtons } from '@/features/events/components/BudgetActionButtons';
import { useAcceptBudget, useEventById } from '@/features/events/hooks/useEvents';
import { useSendDiscordMessage } from '@/features/events/hooks/useDiscordMessages';
import { usePrice } from '@/features/tariffs/hooks/usePrice';
import { BudgetPreviewModal } from '@/shared/components/BudgetPreviewModal';
import { useSendEmail } from '@/shared/hooks/useSendEmail';
import { useUploadPDF } from '@/shared/hooks/useUploadPDF';
import { generateBudgetPDF } from '@/shared/utils/generateBudgetPDF';
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
import { useState } from 'react';

interface EventBudgetsDrawerViewProps {
  eventId: string;
}

export function EventBudgetsDrawerView({ eventId }: EventBudgetsDrawerViewProps) {
  const { data, isLoading } = useEventById(eventId, {
    query: { populate: ['Budget', 'contacts'] },
  });
  const { mutate: acceptBudget, isPending } = useAcceptBudget();
  const { mutate: sendEmail, isPending: isSendingEmail } = useSendEmail();
  const price = usePrice();
  const [previewBudgetIndex, setPreviewBudgetIndex] = useState<number | null>(null);

  const event = data?.data;
  // Use hook with channel ID, falls back to null if not available yet
  const { mutate: sendDiscordMessage } = useSendDiscordMessage(event?.DiscordChannelId ?? null);
  const { mutateAsync: uploadPDF } = useUploadPDF();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!event) {
    return <Typography color="textSecondary">Evento no encontrado</Typography>;
  }

  const budgets = event.Budget ?? [];
  const contactEmail = event.contacts?.[0]?.Email;

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
                        <BudgetActionButtons
                          budgetIndex={index}
                          isLoadingEmail={isSendingEmail}
                          onPreview={setPreviewBudgetIndex}
                          contacts={event.contacts}
                          contactEmail={contactEmail}
                          hasDiscordChannel={!!(event?.DiscordChannelId)}
                          onShareEmail={async (email: string) => {
                            const budgetTotal = (budget.Base ?? 0) + (budget.Dietas ?? 0) + (budget.DJ ? price.dj : 0) + (budget.Equipment ? price.equipment : 0);

                            // Generate PDF
                            const { base64, filename } = await generateBudgetPDF(
                              {
                                Name: event.Name ?? '',
                                Location: event.Location ?? undefined,
                                StartDate: event.StartDate ?? undefined,
                                GigType: event.GigType ?? undefined,
                                Distance: event.Distance,
                              },
                              {
                                Base: budget.Base ?? null,
                                Dietas: budget.Dietas ?? null,
                                DJ: budget.DJ === true,
                                Equipment: budget.Equipment === true,
                                Accepted: budget.Accepted === true,
                              },
                              index,
                              price.dj,
                              price.equipment,
                            );

                            // Upload PDF to backend
                            const uploadedFile = await uploadPDF({ filename, content: base64 });
                            const pdfUrl = uploadedFile.url;

                            const html = `
                              <h2>${event.Name}</h2>
                              <p><strong>Presupuesto ${index + 1}</strong></p>
                              <hr />
                              <h3>Desglose:</h3>
                              <ul>
                                ${budget.Base != null ? `<li>🎸 Efectivishow: ${budget.Base} €</li>` : ''}
                                ${budget.Dietas != null ? `<li>🚐 Dietas y transporte: ${budget.Dietas} €</li>` : ''}
                                ${budget.DJ ? `<li>🎧 EfectiviDJs: ${price.dj} €</li>` : ''}
                                ${budget.Equipment ? `<li>🔊 Equipo: ${price.equipment} €</li>` : ''}
                              </ul>
                              <hr />
                              <h3>Total: ${budgetTotal} €</h3>
                              <p><a href="${pdfUrl}">📎 Descargar PDF</a></p>
                            `;
                            sendEmail({ email, subject: `Presupuesto para ${event.Name}`, html });
                          }}
                          onShareDiscord={async () => {
                            if (!event.DiscordChannelId) return;
                            const budgetTotal = (budget.Base ?? 0) + (budget.Dietas ?? 0) + (budget.DJ ? price.dj : 0) + (budget.Equipment ? price.equipment : 0);

                            // Generate PDF
                            const { base64, filename } = await generateBudgetPDF(
                              {
                                Name: event.Name ?? '',
                                Location: event.Location ?? undefined,
                                StartDate: event.StartDate ?? undefined,
                                GigType: event.GigType ?? undefined,
                                Distance: event.Distance,
                              },
                              {
                                Base: budget.Base ?? null,
                                Dietas: budget.Dietas ?? null,
                                DJ: budget.DJ === true,
                                Equipment: budget.Equipment === true,
                                Accepted: budget.Accepted === true,
                              },
                              index,
                              price.dj,
                              price.equipment,
                            );

                            // Upload PDF to backend
                            const uploadedFile = await uploadPDF({ filename, content: base64 });
                            const pdfUrl = uploadedFile.url;

                            // Send Discord message with PDF link
                            const discordMessage = `📋 **Presupuesto ${index + 1} compartido**\n\n**${event.Name}**\n\n**Desglose:**\n${budget.Base != null ? `🎸 Efectivishow: ${budget.Base} €\n` : ''}${budget.Dietas != null ? `🚐 Dietas y transporte: ${budget.Dietas} €\n` : ''}${budget.DJ ? `🎧 EfectiviDJs: ${price.dj} €\n` : ''}${budget.Equipment ? `🔊 Equipo: ${price.equipment} €\n` : ''}\n**Total: ${budgetTotal} €**\n\n📎 [Descargar PDF](${pdfUrl})`;
                            sendDiscordMessage(discordMessage);
                          }}
                        />
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

      {event.Budget && previewBudgetIndex != null && previewBudgetIndex < event.Budget.length && (
        <BudgetPreviewModal
          open
          onClose={() => setPreviewBudgetIndex(null)}
          event={{
            Name: event.Name ?? '',
            Location: event.Location ?? undefined,
            StartDate: event.StartDate ?? undefined,
            GigType: event.GigType ?? undefined,
            Distance: event.Distance,
          }}
          budget={event.Budget[previewBudgetIndex] as import('@/features/events/hooks/useEventForm').BudgetItem}
          budgetIndex={previewBudgetIndex}
        />
      )}
    </Stack>
  );
}

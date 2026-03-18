import { useDiscordChannels } from '@/features/events/hooks/useDiscordChannels';
import { useEventById } from '@/features/events/hooks/useEvents';
import { eventToFormState, useEventForm } from '@/features/events/hooks/useEventForm';
import type { EventFormState, EventFormDispatch } from '@/features/events/hooks/useEventForm';
import { PageLayout } from '@/shared/layouts/PageLayout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

dayjs.locale('es');

const EVENT_TYPES = [
  { value: 'Reservation', label: 'Reserva' },
  { value: 'Event', label: 'Evento' },
] as const;

const GIG_TYPES = [
  { value: 'Wedding', label: 'Boda' },
  { value: 'Party', label: 'Fiesta privada' },
  { value: 'Village', label: 'Fiesta patronal' },
  { value: 'Gig', label: 'Bolo/concierto' },
] as const;

export default function EventEditPage() {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const TAB_MAP: Record<string, number> = { info: 0, logistics: 1, budget: 2, chat: 3 };
  const [tab, setTab] = useState(() => TAB_MAP[searchParams.get('openTab') ?? 'info'] ?? 0);

  const { data, isLoading } = useEventById(documentId ?? '', {
    query: { populate: ['contacts', 'Budget', 'Logistic'] },
  });
  const { data: channels = [], isLoading: channelsLoading } = useDiscordChannels();

  const event = data?.data;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <PageLayout
        header={
          <Stack direction="row" alignItems="center" gap={1}>
            <IconButton onClick={() => navigate(-1)} size="small">
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {isLoading ? 'Cargando...' : `Editar: ${event?.Name ?? 'Evento'}`}
            </Typography>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button variant="contained">
              Guardar
            </Button>
          </Stack>
        }
      >
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}>
            <CircularProgress />
          </Box>
        ) : !event ? (
          <Typography color="textSecondary">Evento no encontrado</Typography>
        ) : (
          <EventEditForm
            event={event}
            tab={tab}
            setTab={setTab}
            channels={channels}
            channelsLoading={channelsLoading}
          />
        )}
      </PageLayout>
    </LocalizationProvider>
  );
}

/** Inner form component — only mounts when event is loaded */
function EventEditForm({
  event,
  tab,
  setTab,
  channels,
  channelsLoading,
}: {
  event: Record<string, unknown>;
  tab: number;
  setTab: (v: number) => void;
  channels: { id: string; name: string }[];
  channelsLoading: boolean;
}) {
  const [form, dispatch] = useEventForm(eventToFormState(event));
  const linkedChannel = channels.find((c) => c.id === form.DiscordChannelId);

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', width: '100%' }}>
      <Box sx={{ position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1, pb: 0.5 }}>
        <Tabs value={tab} onChange={(_e, v: number) => setTab(v)} sx={{ mb: 3 }}>
          <Tab label="Info" />
          <Tab label="Logística" />
          <Tab label="Económica" />
          <Tab label="Discord" />
        </Tabs>
      </Box>

      {tab === 0 && <InfoTab form={form} dispatch={dispatch} />}
      {tab === 1 && <LogisticsTab form={form} dispatch={dispatch} />}
      {tab === 2 && <BudgetTab form={form} dispatch={dispatch} />}
      {tab === 3 && (
        <DiscordTab
          form={form}
          dispatch={dispatch}
          channels={channels}
          channelsLoading={channelsLoading}
          linkedChannel={linkedChannel}
        />
      )}
    </Box>
  );
}

/** Tab: Info */
function InfoTab({ form, dispatch }: { form: EventFormState; dispatch: EventFormDispatch }) {
  return (
    <Stack spacing={3}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Typography variant="h6">Datos básicos</Typography>
          <Divider />

          <TextField
            label="Nombre"
            required
            fullWidth
            value={form.Name}
            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'Name', value: e.target.value })}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormControl fullWidth required>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={form.Type}
                label="Tipo"
                onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'Type', value: e.target.value })}
              >
                {EVENT_TYPES.map((t) => (
                  <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Tipo de evento</InputLabel>
              <Select
                value={form.GigType}
                label="Tipo de evento"
                onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'GigType', value: e.target.value })}
              >
                <MenuItem value="">—</MenuItem>
                {GIG_TYPES.map((t) => (
                  <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <TextField
            label="Ubicación"
            fullWidth
            value={form.Location}
            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'Location', value: e.target.value })}
          />

          <TextField
            label="Distancia (km)"
            type="number"
            fullWidth
            value={form.Distance}
            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'Distance', value: e.target.value })}
          />
        </Stack>
      </Paper>

      <Paper elevation={2} sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Typography variant="h6">Fechas</Typography>
          <Divider />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <DatePicker
              label="Fecha de inicio"
              value={form.StartDate ? dayjs(form.StartDate) : null}
              onChange={(v) => dispatch({ type: 'SET_FIELD', field: 'StartDate', value: v?.format('YYYY-MM-DD') ?? '' })}
              slotProps={{ textField: { fullWidth: true, required: true } }}
            />

            <DatePicker
              label="Fecha de fin"
              value={form.EndDate ? dayjs(form.EndDate) : null}
              onChange={(v) => dispatch({ type: 'SET_FIELD', field: 'EndDate', value: v?.format('YYYY-MM-DD') ?? '' })}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Stack>
        </Stack>
      </Paper>

      <Paper elevation={2} sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Typography variant="h6">Contactos</Typography>
          <Divider />

          <Autocomplete
            multiple
            options={[]}
            value={form.contacts.map((c) => ({ label: c.Name, id: c.documentId }))}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => (
              <TextField {...params} placeholder="Buscar contactos..." />
            )}
            onChange={(_e, value) => {
              dispatch({
                type: 'SET_CONTACT',
                contacts: value.map((v) => ({ documentId: v.id, Name: v.label })),
              });
            }}
          />
        </Stack>
      </Paper>

      <Paper elevation={2} sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Typography variant="h6">Cancelación</Typography>
          <Divider />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.Cancelled}
                  onChange={(e) => {
                    dispatch({ type: 'SET_FIELD', field: 'Cancelled', value: e.target.checked });
                    if (!e.target.checked) {
                      dispatch({ type: 'SET_FIELD', field: 'CancelledDate', value: '' });
                    }
                  }}
                />
              }
              label="Cancelado"
            />

            {form.Cancelled && (
              <DatePicker
                label="Fecha de cancelación"
                value={form.CancelledDate ? dayjs(form.CancelledDate) : null}
                onChange={(v) => dispatch({ type: 'SET_FIELD', field: 'CancelledDate', value: v?.format('YYYY-MM-DD') ?? '' })}
                slotProps={{ textField: { fullWidth: true } }}
              />
            )}
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}

/** Tab: Logística */
function LogisticsTab({ form, dispatch }: { form: EventFormState; dispatch: EventFormDispatch }) {
  return (
    <Stack spacing={3}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Typography variant="h6">Cronología</Typography>
          <Divider />

          {form.Logistic.length === 0 ? (
            <Typography variant="body2" color="text.secondary" textAlign="center">
              No hay paradas definidas.
            </Typography>
          ) : (
            form.Logistic.map((stop, index) => (
              <Paper key={index} variant="outlined" sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="subtitle2">Parada {index + 1}</Typography>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => dispatch({ type: 'REMOVE_STOP', index })}
                    >
                      Eliminar
                    </Button>
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      label="Hora"
                      type="time"
                      value={stop.Time}
                      onChange={(e) => dispatch({ type: 'UPDATE_STOP', index, field: 'Time', value: e.target.value })}
                      slotProps={{ inputLabel: { shrink: true } }}
                      sx={{ minWidth: 140 }}
                    />
                    <TextField
                      label="Etiqueta"
                      fullWidth
                      value={stop.Label}
                      onChange={(e) => dispatch({ type: 'UPDATE_STOP', index, field: 'Label', value: e.target.value })}
                    />
                  </Stack>
                  <TextField
                    label="Descripción"
                    fullWidth
                    value={stop.Description}
                    onChange={(e) => dispatch({ type: 'UPDATE_STOP', index, field: 'Description', value: e.target.value })}
                  />
                </Stack>
              </Paper>
            ))
          )}

          <Button variant="outlined" fullWidth onClick={() => dispatch({ type: 'ADD_STOP' })}>
            Añadir parada
          </Button>
        </Stack>
      </Paper>

      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Mapa de ruta próximamente.
        </Typography>
      </Paper>
    </Stack>
  );
}

/** Tab: Económica */
function BudgetTab({ form, dispatch }: { form: EventFormState; dispatch: EventFormDispatch }) {
  return (
    <Stack spacing={3}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Typography variant="h6">Presupuestos</Typography>
          <Divider />

          {form.Budget.length === 0 ? (
            <Typography variant="body2" color="text.secondary" textAlign="center">
              No hay presupuestos definidos.
            </Typography>
          ) : (
            form.Budget.map((budget, index) => (
              <Paper key={index} variant="outlined" sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="subtitle2">Presupuesto {index + 1}</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={budget.Accepted}
                            onChange={(e) => dispatch({ type: 'UPDATE_BUDGET', index, field: 'Accepted', value: e.target.checked })}
                          />
                        }
                        label="Aceptado"
                      />
                      <Button
                        size="small"
                        color="error"
                        onClick={() => dispatch({ type: 'REMOVE_BUDGET', index })}
                      >
                        Eliminar
                      </Button>
                    </Stack>
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      label="Base (€)"
                      type="number"
                      value={budget.Base ?? ''}
                      onChange={(e) => dispatch({ type: 'UPDATE_BUDGET', index, field: 'Base', value: e.target.value ? Number(e.target.value) : null })}
                      sx={{ minWidth: 140 }}
                    />
                    <TextField
                      label="Dietas (€)"
                      type="number"
                      value={budget.Dietas ?? ''}
                      onChange={(e) => dispatch({ type: 'UPDATE_BUDGET', index, field: 'Dietas', value: e.target.value ? Number(e.target.value) : null })}
                      sx={{ minWidth: 140 }}
                    />
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={budget.Equipment}
                          onChange={(e) => dispatch({ type: 'UPDATE_BUDGET', index, field: 'Equipment', value: e.target.checked })}
                        />
                      }
                      label="Equipo incluido"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={budget.DJ}
                          onChange={(e) => dispatch({ type: 'UPDATE_BUDGET', index, field: 'DJ', value: e.target.checked })}
                        />
                      }
                      label="DJ incluido"
                    />
                  </Stack>
                </Stack>
              </Paper>
            ))
          )}

          <Button variant="outlined" fullWidth onClick={() => dispatch({ type: 'ADD_BUDGET' })}>
            Añadir presupuesto
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
}

/** Tab: Discord */
function DiscordTab({
  form,
  dispatch,
  channels,
  channelsLoading,
  linkedChannel,
}: {
  form: EventFormState;
  dispatch: EventFormDispatch;
  channels: { id: string; name: string }[];
  channelsLoading: boolean;
  linkedChannel?: { id: string; name: string };
}) {
  return (
    <Stack spacing={3}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Typography variant="h6">Canal de Discord</Typography>
          <Divider />

          {form.DiscordChannelId ? (
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Chip
                    label={`#${linkedChannel?.name ?? form.DiscordChannelId}`}
                    color="primary"
                    variant="outlined"
                  />
                  <Typography variant="body2" color="text.secondary">
                    Canal vinculado
                  </Typography>
                </Stack>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<LinkOffIcon />}
                  size="small"
                  onClick={() => dispatch({ type: 'SET_FIELD', field: 'DiscordChannelId', value: '' })}
                >
                  Desvincular
                </Button>
              </Stack>

              <Divider />

              <Typography variant="subtitle2" color="text.secondary">
                Cambiar canal
              </Typography>
              <Autocomplete
                options={channels.filter((c) => c.id !== form.DiscordChannelId)}
                getOptionLabel={(option) => `#${option.name}`}
                loading={channelsLoading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Seleccionar otro canal..."
                    size="small"
                  />
                )}
                onChange={(_e, value) => {
                  if (value) {
                    dispatch({ type: 'SET_FIELD', field: 'DiscordChannelId', value: value.id });
                  }
                }}
              />
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary" textAlign="center">
              No hay canal vinculado. Puedes vincularlo desde la pestaña Conversación en la vista de detalle.
            </Typography>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
}

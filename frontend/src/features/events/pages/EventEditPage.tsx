import { useCreateDiscordCategory, useCreateDiscordChannel, useDiscordCategories, useDiscordChannels, useLinkDiscordChannel } from '@/features/events/hooks/useDiscordChannels';
import type { EventFormDispatch, EventFormState } from '@/features/events/hooks/useEventForm';
import { eventToFormState, useEventForm } from '@/features/events/hooks/useEventForm';
import { useEventById, useUpdateEvent } from '@/features/events/hooks/useEvents';
import { useTarifDistance } from '@/features/events/hooks/useTarifDistance';
import { usePeople } from '@/features/people/hooks/usePeople';
import { CreatePersonModal } from '@/features/people/components/CreatePersonModal';
import { usePrice } from '@/features/tariffs/hooks/usePrice';
import { useQueryClient } from '@tanstack/react-query';
import { Timeline } from '@/shared/components/Timeline';
import { UserAvatar } from '@/shared/components/UserAvatar';
import { DEFAULT_STOP_COLOR, DEFAULT_STOP_ICON, STOP_TYPES, STOP_TYPE_MAP } from '@/shared/constants/stopTypes';
import { useSnackbar } from '@/shared/context/SnackbarContext';
import { useUsers } from '@/shared/hooks/useUsers';
import { logisticToTimelineItems } from '@/shared/utils/logisticUtils';
import { PageLayout } from '@/shared/layouts/PageLayout';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LinkIcon from '@mui/icons-material/Link';
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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { useCallback, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

dayjs.locale('es');

const EVENT_TYPES = [
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
  const queryClient = useQueryClient();
  const TAB_MAP: Record<string, number> = { info: 0, logistics: 1, budget: 2, chat: 3 };
  const [tab, setTab] = useState(() => TAB_MAP[searchParams.get('openTab') ?? 'info'] ?? 0);
  const [openCreatePersonModal, setOpenCreatePersonModal] = useState(false);

  const { data, isLoading } = useEventById(documentId ?? '', {
    query: { populate: ['contacts', 'Budget', 'Logistic'] },
  });
  const { data: channels = [], isLoading: channelsLoading } = useDiscordChannels();
  const { mutateAsync: updateEvent, isPending: isSaving } = useUpdateEvent();
  const { showSuccess, showError } = useSnackbar();

  const formRef = useRef<(() => EventFormState) | null>(null);

  const handleSave = useCallback(async () => {
    if (!documentId || !formRef.current) return;
    const form = formRef.current();
    try {
    await updateEvent({
      id: documentId,
      body: {
        data: {
          Name: form.Name,
          Type: form.Type || undefined,
          GigType: form.GigType || undefined,
          Location: form.Location || undefined,
          Distance: form.Distance ? Number(form.Distance) : undefined,
          StartDate: form.StartDate || undefined,
          EndDate: form.EndDate || undefined,
          EventStatus: form.Status || undefined,
          CancelledDate: form.CancelledDate || undefined,
          DiscordChannelId: form.DiscordChannelId || null,
          contacts: form.contacts.map((c) => c.documentId),
          Budget: form.Budget.map((b) => ({
            Base: b.Base ?? undefined,
            Equipment: b.Equipment,
            Dietas: b.Dietas ?? undefined,
            DJ: b.DJ,
            Accepted: b.Accepted,
          })),
          Logistic: form.Logistic.map((s) => ({
            Time: s.Time || undefined,
            Label: s.Label || undefined,
            Description: s.Description || undefined,
            Type: s.Type || undefined,
            PickUpUser: s.PickUpUser || undefined,
            DoneBy: s.DoneBy || undefined,
          })),
        },
      },
    });
    showSuccess('Evento guardado');
    await queryClient.refetchQueries({ queryKey: ['events', documentId] });
    navigate(`/events/${documentId}`);
    } catch {
      showError('Error al guardar el evento');
    }
  }, [documentId, updateEvent, navigate, showSuccess, showError, queryClient]);

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
            <Button variant="contained" onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Guardar'}
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
            documentId={documentId ?? ''}
            event={event}
            tab={tab}
            setTab={setTab}
            channels={channels}
            channelsLoading={channelsLoading}
            formRef={formRef}
            openCreatePersonModal={openCreatePersonModal}
            setOpenCreatePersonModal={setOpenCreatePersonModal}
          />
        )}
      </PageLayout>
    </LocalizationProvider>
  );
}

/** Inner form component — only mounts when event is loaded */
function EventEditForm({
  documentId,
  event,
  tab,
  setTab,
  channels,
  channelsLoading,
  formRef,
  openCreatePersonModal,
  setOpenCreatePersonModal,
}: {
  documentId: string;
  event: Record<string, unknown>;
  tab: number;
  setTab: (v: number) => void;
  channels: { id: string; name: string }[];
  channelsLoading: boolean;
  formRef: React.MutableRefObject<(() => EventFormState) | null>;
  openCreatePersonModal: boolean;
  setOpenCreatePersonModal: (v: boolean) => void;
}) {
  const [form, dispatch] = useEventForm(eventToFormState(event));
  const { data: peopleData, refetch: refetchPeople } = usePeople();

  // Expose current form state to parent via ref
  formRef.current = () => form;
  const linkedChannel = channels.find((c) => c.id === form.DiscordChannelId);
  const defaultDietas = useTarifDistance(form.Distance ? Number(form.Distance) : null);
  const price = usePrice();

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

      {tab === 0 && (
        <InfoTab
          form={form}
          dispatch={dispatch}
          people={peopleData?.data ?? []}
          openCreatePersonModal={openCreatePersonModal}
          setOpenCreatePersonModal={setOpenCreatePersonModal}
          refetchPeople={refetchPeople}
        />
      )}
      {tab === 1 && <LogisticsTab form={form} dispatch={dispatch} />}
      {tab === 2 && <BudgetTab form={form} dispatch={dispatch} defaultDietas={defaultDietas} price={price} />}
      {tab === 3 && (
        <DiscordTab
          documentId={documentId}
          event={event}
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
function InfoTab({
  form,
  dispatch,
  people = [],
  openCreatePersonModal,
  setOpenCreatePersonModal,
  refetchPeople,
}: {
  form: EventFormState;
  dispatch: EventFormDispatch;
  people?: any[];
  openCreatePersonModal: boolean;
  setOpenCreatePersonModal: (v: boolean) => void;
  refetchPeople: () => void;
}) {
  const handlePersonCreated = (newPerson: any) => {
    // Extraer documentId y Name de la persona creada
    const contact = {
      documentId: newPerson.documentId,
      Name: newPerson.Name,
    };
    // Agregar la persona creada a los contactos
    dispatch({
      type: 'SET_CONTACT',
      contacts: [...form.contacts, contact],
    });
    // Refrescar la lista de personas
    refetchPeople();
  };

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
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Contactos</Typography>
            <Button size="small" variant="outlined" onClick={() => setOpenCreatePersonModal(true)}>
              + Nuevo
            </Button>
          </Stack>
          <Divider />

          <Autocomplete
            multiple
            options={people}
            getOptionLabel={(option) => option.Name || ''}
            value={form.contacts}
            renderInput={(params) => (
              <TextField {...params} placeholder="Buscar contactos..." />
            )}
            onChange={(_e, value) => {
              dispatch({
                type: 'SET_CONTACT',
                contacts: value,
              });
            }}
            isOptionEqualToValue={(option, value) => option.documentId === value.documentId}
          />

          <CreatePersonModal
            open={openCreatePersonModal}
            onClose={() => setOpenCreatePersonModal(false)}
            onPersonCreated={handlePersonCreated}
          />
        </Stack>
      </Paper>

      <Paper elevation={2} sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Typography variant="h6">Estado</Typography>
          <Divider />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <TextField
              select
              label="Estado"
              value={form.Status}
              onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'Status', value: e.target.value })}
              fullWidth
              sx={{ maxWidth: 250 }}
            >
              <MenuItem value="Requested">Solicitado</MenuItem>
              <MenuItem value="Accepted">Aceptado</MenuItem>
              <MenuItem value="Cancelled">Cancelado</MenuItem>
            </TextField>

            {form.Status === 'Cancelled' && (
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
  const { data: users = [] } = useUsers();
  const timelineItems = logisticToTimelineItems(form.Logistic, users);

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
      {/* Timeline preview — left side on desktop, top on mobile */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          width: { xs: '100%', md: 280 },
          flexShrink: 0,
          alignSelf: 'flex-start',
          position: { md: 'sticky' },
          top: { md: 72 },
        }}
      >
        <Stack spacing={2}>
          <Typography variant="subtitle2" color="text.secondary">Vista previa</Typography>
          <Divider />
          {timelineItems.length === 0 ? (
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Añade paradas para ver la cronología.
            </Typography>
          ) : (
            <Timeline items={timelineItems} />
          )}
        </Stack>
      </Paper>

      {/* Form — right side */}
      <Stack spacing={3} sx={{ flexGrow: 1 }}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Typography variant="h6">Cronología</Typography>
            <Divider />

            {form.Logistic.length === 0 ? (
              <Typography variant="body2" color="text.secondary" textAlign="center">
                No hay paradas definidas.
              </Typography>
            ) : (
              form.Logistic
                .map((stop, index) => ({ stop, index }))
                .sort((a, b) => (a.stop.Time || '\uffff').localeCompare(b.stop.Time || '\uffff'))
                .map(({ stop, index }) => (
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
                      <Autocomplete
                        options={STOP_TYPES}
                        value={STOP_TYPES.find((t) => t.value === stop.Type) ?? null}
                        onChange={(_e, v) => dispatch({ type: 'UPDATE_STOP', index, field: 'Type', value: v?.value ?? '' })}
                        getOptionLabel={(o) => o.label}
                        renderOption={(props, option) => (
                          <Box component="li" {...props} key={option.value} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{ color: option.color, display: 'flex' }}>{option.icon}</Box>
                            {option.label}
                          </Box>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Tipo"
                            slotProps={{
                              input: {
                                ...params.InputProps,
                                startAdornment: stop.Type && STOP_TYPE_MAP[stop.Type] ? (
                                  <Box sx={{ color: STOP_TYPE_MAP[stop.Type].color, display: 'flex', ml: 1, mr: -0.5 }}>
                                    {STOP_TYPE_MAP[stop.Type].icon}
                                  </Box>
                                ) : undefined,
                              },
                            }}
                          />
                        )}
                        sx={{ minWidth: 200 }}
                      />
                      <DateTimePicker
                        label="Fecha y hora"
                        value={stop.Time ? dayjs(stop.Time) : null}
                        onChange={(v) => dispatch({ type: 'UPDATE_STOP', index, field: 'Time', value: v ? v.toISOString() : null })}
                        slotProps={{ textField: { fullWidth: true, sx: { minWidth: 240 } } }}
                      />
                    </Stack>
                    {stop.Type === 'pickup' && (
                      <Autocomplete
                        options={users}
                        value={users.find((u) => u.documentId === stop.PickUpUser) ?? null}
                        onChange={(_e, v) => dispatch({ type: 'UPDATE_STOP', index, field: 'PickUpUser', value: v?.documentId ?? null })}
                        getOptionLabel={(o) => o.displayName || o.username}
                        renderInput={(params) => (
                          <TextField {...params} label="Usuario a recoger" />
                        )}
                      />
                    )}
                    <Autocomplete
                      options={users}
                      value={users.find((u) => u.documentId === stop.DoneBy) ?? null}
                      onChange={(_e, v) => dispatch({ type: 'UPDATE_STOP', index, field: 'DoneBy', value: v?.documentId ?? null })}
                      getOptionLabel={(o) => o.displayName || o.username}
                      renderInput={(params) => (
                        <TextField {...params} label="Responsable (opcional)" />
                      )}
                    />
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField
                        label="Etiqueta"
                        fullWidth
                        value={stop.Label}
                        onChange={(e) => dispatch({ type: 'UPDATE_STOP', index, field: 'Label', value: e.target.value })}
                      />
                      <TextField
                        label="Descripción"
                        fullWidth
                        value={stop.Description}
                        onChange={(e) => dispatch({ type: 'UPDATE_STOP', index, field: 'Description', value: e.target.value })}
                      />
                    </Stack>
                  </Stack>
                </Paper>
              ))
            )}

            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                const defaults: Record<string, unknown> = {};
                if (form.StartDate) {
                  defaults.Time = `${form.StartDate}T00:00:00`;
                }
                dispatch({ type: 'ADD_STOP', defaults });
              }}
            >
              Añadir parada
            </Button>
          </Stack>
        </Paper>

        <Paper elevation={2} sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="subtitle2" color="text.secondary">Resumen de paradas</Typography>
            <Divider />
            {form.Logistic.filter((s) => s.Time || s.Label).length === 0 ? (
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Sin paradas definidas.
              </Typography>
            ) : (
              <Stack spacing={2}>
                {form.Logistic
                  .filter((s) => s.Time || s.Label)
                  .map((stop, idx) => ({ stop, idx }))
                  .sort((a, b) => (a.stop.Time || '9999-12-31').localeCompare(b.stop.Time || '9999-12-31'))
                  .map(({ stop, idx }) => {
                    const cfg = STOP_TYPE_MAP[stop.Type];
                    const user = stop.Type === 'pickup' && stop.PickUpUser ? users.find((u) => u.documentId === stop.PickUpUser) : null;
                    const timeStr = stop.Time ? dayjs(stop.Time).format('D MMM HH:mm') : '—';
                    return (
                      <Paper key={idx} variant="outlined" sx={{ p: 1.5, bgcolor: 'background.default' }}>
                        <Stack spacing={1}>
                          <Stack direction="row" alignItems="center" gap={1}>
                            <Box sx={{ color: cfg?.color ?? DEFAULT_STOP_COLOR, display: 'flex', fontSize: 20 }}>
                              {cfg?.icon ?? DEFAULT_STOP_ICON}
                            </Box>
                            <Stack spacing={0} flex={1}>
                              <Typography variant="subtitle2" fontWeight={600}>
                                {timeStr} • {stop.Label || cfg?.label || 'Sin etiqueta'}
                              </Typography>
                              {stop.Description && (
                                <Typography variant="caption" color="text.secondary">
                                  {stop.Description}
                                </Typography>
                              )}
                            </Stack>
                          </Stack>
                          {user && (
                            <Typography variant="caption" color="primary" sx={{ ml: 4 }}>
                              👤 {user.displayName || user.username}
                            </Typography>
                          )}
                          {stop.DoneBy && (() => {
                            const doneByUser = users.find((u) => u.documentId === stop.DoneBy);
                            return doneByUser ? (
                              <Stack direction="row" alignItems="center" gap={0.5} sx={{ ml: 4 }}>
                                <UserAvatar avatar={doneByUser.avatar} size={18} />
                                <Typography variant="caption" color="text.secondary">
                                  {doneByUser.displayName || doneByUser.username}
                                </Typography>
                              </Stack>
                            ) : null;
                          })()}
                        </Stack>
                      </Paper>
                    );
                  })}
              </Stack>
            )}
          </Stack>
        </Paper>
      </Stack>
    </Stack>
  );
}

/** Tab: Económica */
function BudgetTab({ form, dispatch, defaultDietas, price }: { form: EventFormState; dispatch: EventFormDispatch; defaultDietas: number | null; price: { base: number; dj: number; equipment: number } }) {
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
                      label="🎸 Efectivishow (€)"
                      type="number"
                      value={budget.Base ?? price.base ?? ''}
                      onChange={(e) => dispatch({ type: 'UPDATE_BUDGET', index, field: 'Base', value: e.target.value ? Number(e.target.value) : null })}
                      sx={{ minWidth: 140 }}
                    />
                    <TextField
                      label="🚐 Dietas y transporte (€)"
                      type="number"
                      value={budget.Dietas ?? (form.Distance ? defaultDietas ?? 0 : 0) ?? ''}
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
                      label={`🔊 Equipo (+${price.equipment} €)`}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={budget.DJ}
                          onChange={(e) => dispatch({ type: 'UPDATE_BUDGET', index, field: 'DJ', value: e.target.checked })}
                        />
                      }
                      label={`🎧 EfectiviDJs (+${price.dj} €)`}
                    />
                  </Stack>
                  <Divider />
                  <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={1}>
                    <Typography variant="subtitle2" color="text.secondary">Total:</Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {((budget.Base ?? 0) + (budget.Dietas ?? 0) + (budget.DJ ? price.dj : 0) + (budget.Equipment ? price.equipment : 0)).toLocaleString('es-ES')} €
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>
            ))
          )}

          <Button
            variant="outlined"
            fullWidth
            onClick={() => {
              const defaults: Record<string, unknown> = {};
              if (price.base) defaults.Base = price.base;
              if (defaultDietas != null) defaults.Dietas = defaultDietas;
              dispatch({ type: 'ADD_BUDGET', defaults });
            }}
          >
            Añadir presupuesto
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
}

/** Tab: Discord */
function DiscordTab({
  documentId,
  event,
  form,
  dispatch,
  channels,
  channelsLoading,
  linkedChannel,
}: {
  documentId: string;
  event: Record<string, unknown>;
  form: EventFormState;
  dispatch: EventFormDispatch;
  channels: { id: string; name: string }[];
  channelsLoading: boolean;
  linkedChannel?: { id: string; name: string };
}) {
  const { data: categories = [], isLoading: categoriesLoading } = useDiscordCategories();
  const { mutateAsync: createChannel, isPending: isCreating } = useCreateDiscordChannel();
  const { mutateAsync: createCategory, isPending: isCreatingCategory } = useCreateDiscordCategory();
  const { mutate: linkChannel } = useLinkDiscordChannel(documentId, event ? {
    Name: event.Name as string | undefined,
    Location: event.Location as string | undefined,
    Distance: event.Distance ? Number(event.Distance) : undefined,
    contacts: event.contacts as Array<{ Name: string; Type?: string; Email?: string; Number?: string }> | undefined,
  } : undefined);

  const [selectedChannel, setSelectedChannel] = useState<{ id: string; name: string } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<{ id: string; name: string } | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');

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
                  onClick={() => {
                    dispatch({ type: 'SET_FIELD', field: 'DiscordChannelId', value: '' });
                    setSelectedChannel(null);
                    setSelectedCategory(null);
                    setNewChannelName('');
                    setNewCategoryName('');
                    setShowNewCategory(false);
                  }}
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
            <Stack spacing={2}>
              <Typography variant="subtitle2">Vincular canal de Discord</Typography>

              {/* Select existing channel */}
              <Stack direction="row" spacing={1} alignItems="center">
                <Autocomplete
                  options={channels}
                  getOptionLabel={(option) => `#${option.name}`}
                  loading={channelsLoading}
                  value={selectedChannel}
                  onChange={(_e, value) => setSelectedChannel(value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Buscar canal existente..."
                      size="small"
                    />
                  )}
                  sx={{ flexGrow: 1 }}
                />
                <Button
                  variant="contained"
                  startIcon={<LinkIcon />}
                  disabled={!selectedChannel}
                  onClick={() => {
                    if (selectedChannel) {
                      dispatch({ type: 'SET_FIELD', field: 'DiscordChannelId', value: selectedChannel.id });
                      linkChannel(selectedChannel.id);
                      setSelectedChannel(null);
                    }
                  }}
                >
                  Vincular
                </Button>
              </Stack>

              <Divider><Typography variant="caption" color="text.secondary">o</Typography></Divider>

              {/* Create new channel with optional category */}
              <Stack spacing={1.5}>
                {/* Category selection */}
                <Stack spacing={1}>
                  <Typography variant="caption" color="text.secondary">Categoría (opcional)</Typography>
                  {!showNewCategory ? (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Autocomplete
                        options={categories}
                        getOptionLabel={(option) => option.name}
                        loading={categoriesLoading}
                        value={selectedCategory}
                        onChange={(_e, value) => setSelectedCategory(value)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Seleccionar categoría..."
                            size="small"
                          />
                        )}
                        sx={{ flexGrow: 1 }}
                      />
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => setShowNewCategory(true)}
                      >
                        Crear nueva
                      </Button>
                    </Stack>
                  ) : (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <TextField
                        size="small"
                        placeholder="Nombre de la categoría..."
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        sx={{ flexGrow: 1 }}
                      />
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => {
                          setShowNewCategory(false);
                          setNewCategoryName('');
                          setSelectedCategory(null);
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        disabled={!newCategoryName.trim() || isCreatingCategory}
                        onClick={async () => {
                          const category = await createCategory(newCategoryName.trim());
                          setSelectedCategory({ id: category.id, name: category.name });
                          setNewCategoryName('');
                          setShowNewCategory(false);
                        }}
                      >
                        Crear
                      </Button>
                    </Stack>
                  )}
                </Stack>

                {/* Channel name input */}
                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField
                    size="small"
                    placeholder="Nombre del nuevo canal..."
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                    sx={{ flexGrow: 1 }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    disabled={!newChannelName.trim() || isCreating}
                    onClick={async () => {
                      const channel = await createChannel({
                        name: newChannelName.trim(),
                        categoryId: selectedCategory?.id,
                      });
                      dispatch({ type: 'SET_FIELD', field: 'DiscordChannelId', value: channel.id });
                      linkChannel(channel.id);
                      setNewChannelName('');
                      setSelectedCategory(null);
                    }}
                  >
                    Crear y vincular
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
}

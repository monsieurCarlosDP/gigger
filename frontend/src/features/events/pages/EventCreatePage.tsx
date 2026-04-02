import type { EventFormDispatch, EventFormState } from '@/features/events/hooks/useEventForm';
import { useEventForm } from '@/features/events/hooks/useEventForm';
import { useCreateEvent } from '@/features/events/hooks/useEvents';
import { useTarifDistance } from '@/features/events/hooks/useTarifDistance';
import { CreatePersonModal } from '@/features/people/components/CreatePersonModal';
import { usePeople } from '@/features/people/hooks/usePeople';
import { usePrice } from '@/features/tariffs/hooks/usePrice';
import { Timeline } from '@/shared/components/Timeline';
import { UserAvatar } from '@/shared/components/UserAvatar';
import { DEFAULT_STOP_COLOR, DEFAULT_STOP_ICON, STOP_TYPES, STOP_TYPE_MAP } from '@/shared/constants/stopTypes';
import { useAuth } from '@/shared/context/AuthContext';
import { useSnackbar } from '@/shared/context/SnackbarContext';
import { useUsers } from '@/shared/hooks/useUsers';
import { PageLayout } from '@/shared/layouts/PageLayout';
import { logisticToTimelineItems } from '@/shared/utils/logisticUtils';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
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
import { useNavigate, useSearchParams } from 'react-router-dom';

dayjs.locale('es');

const GIG_TYPES = [
  { value: 'Wedding', label: 'Boda' },
  { value: 'Party', label: 'Fiesta privada' },
  { value: 'Village', label: 'Fiesta patronal' },
  { value: 'Gig', label: 'Bolo/concierto' },
] as const;

export default function EventCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const TAB_MAP: Record<string, number> = { info: 0, logistics: 1, budget: 2 };
  const [tab, setTab] = useState(() => TAB_MAP[searchParams.get('openTab') ?? 'info'] ?? 0);
  const [openCreatePersonModal, setOpenCreatePersonModal] = useState(false);

  const { mutateAsync: createEvent, isPending: isSaving } = useCreateEvent();
  const { showSuccess, showError } = useSnackbar();

  const [form, dispatch] = useEventForm({
    Name: '',
    Type: 'Event',
    GigType: '',
    Location: '',
    Distance: '',
    StartDate: dayjs().format('YYYY-MM-DD'),
    EndDate: '',
    Status: 'Requested',
    CancelledDate: '',
    DiscordChannelId: '',
    contacts: [],
    Budget: [{ Base: null, Equipment: false, Dietas: null, DJ: false, Accepted: false }],
    Logistic: [],
  });

  const formRef = useRef<(() => EventFormState) | null>(null);
  formRef.current = () => form;

  const handleSave = useCallback(async () => {
    if (!user?.documentId) {
      showError('Usuario no autenticado');
      return;
    }

    if (!formRef.current) return;
    const form = formRef.current();

    if (!form.Name.trim()) {
      showError('El nombre del evento es obligatorio');
      return;
    }

    if (!form.StartDate) {
      showError('La fecha de inicio es obligatoria');
      return;
    }

    try {
      await createEvent({
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
          DiscordChannelId: form.DiscordChannelId || undefined,
          CreatedByUser: user.documentId,
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
        } as any,
      });

      showSuccess('Evento creado correctamente');
      navigate('/events');
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Error al crear evento');
    }
  }, [user, createEvent, navigate, showSuccess, showError]);

  const handleCancel = () => {
    navigate('/events');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <PageLayout
        header={
          <Stack direction="row" alignItems="center" gap={1}>
            <IconButton onClick={handleCancel} size="small">
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {form.Name.trim() || 'Crear Evento'}
            </Typography>
            <Button variant="outlined" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Guardar'}
            </Button>
          </Stack>
        }
      >
        <EventCreateForm
          form={form}
          dispatch={dispatch}
          tab={tab}
          setTab={setTab}
          openCreatePersonModal={openCreatePersonModal}
          setOpenCreatePersonModal={setOpenCreatePersonModal}
        />
      </PageLayout>
    </LocalizationProvider>
  );
}

/** Inner form component */
function EventCreateForm({
  form,
  dispatch,
  tab,
  setTab,
  openCreatePersonModal,
  setOpenCreatePersonModal,
}: {
  form: EventFormState;
  dispatch: EventFormDispatch;
  tab: number;
  setTab: (v: number) => void;
  openCreatePersonModal: boolean;
  setOpenCreatePersonModal: (v: boolean) => void;
}) {
  const { data: peopleData, refetch: refetchPeople } = usePeople();
  const defaultDietas = useTarifDistance(form.Distance ? Number(form.Distance) : null);
  const price = usePrice();

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', width: '100%' }}>
      <Box sx={{ position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1, pb: 0.5 }}>
        <Tabs value={tab} onChange={(_e, v: number) => setTab(v)} sx={{ mb: 3 }}>
          <Tab label="Info" />
          <Tab label="Logística" />
          <Tab label="Económica" />
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

          <DatePicker
            label="Fecha"
            value={form.StartDate ? dayjs(form.StartDate) : null}
            onChange={(v) => dispatch({ type: 'SET_FIELD', field: 'StartDate', value: v?.format('YYYY-MM-DD') ?? '' })}
            slotProps={{ textField: { fullWidth: true, required: true } }}
          />
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
        </Stack>

        <CreatePersonModal
          open={openCreatePersonModal}
          onClose={() => setOpenCreatePersonModal(false)}
          onPersonCreated={handlePersonCreated}
        />
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
function BudgetTab({
  form,
  dispatch,
  defaultDietas,
  price,
}: {
  form: EventFormState;
  dispatch: EventFormDispatch;
  defaultDietas: number | null;
  price: { base: number; dj: number; equipment: number };
}) {
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

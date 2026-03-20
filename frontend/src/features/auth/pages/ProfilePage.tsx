import { useDeleteEvent, useUpdateEvent } from '@/features/events/hooks/useEvents';
import type { AvatarConfig } from '@/shared/api/client';
import { api } from '@/shared/api/client';
import type { BlockedRange } from '@/shared/components/Calendar';
import { Calendar } from '@/shared/components/Calendar';
import { UserAvatar } from '@/shared/components/UserAvatar';
import { useAuth } from '@/shared/context/AuthContext';
import { useSnackbar } from '@/shared/context/SnackbarContext';
import { PageLayout } from '@/shared/layouts/PageLayout';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FaceIcon from '@mui/icons-material/Face';
import PersonIcon from '@mui/icons-material/Person';
import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import type { FormEvent } from 'react';
import { useState } from 'react';

// --- Avatar option values (dicebear avataaars) ---

import { AVATAR_OPTIONS, randomAvatar } from '@/shared/constants/avatarOptions';

// --- Shared section wrapper ---

function ProfileSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
}

// --- Tab 0: Info ---

function PersonalInfoForm() {
  const { user, refreshUser } = useAuth();
  const { showSuccess, showError } = useSnackbar();
  const [username, setUsername] = useState(user?.username ?? '');
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [isSaving, setIsSaving] = useState(false);

  if (!user) return null;

  const hasChanges = username !== user.username || displayName !== (user.displayName ?? '');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.updateMe(user.id, { username, displayName });
      await refreshUser();
      showSuccess('Perfil actualizado');
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Error al actualizar perfil');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ProfileSection title="Datos personales">
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Nombre visible"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Nombre que aparecerá en la plataforma"
          fullWidth
        />
        <TextField
          label="Email"
          value={user.email}
          disabled
          fullWidth
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isSaving || !hasChanges || !username}
          >
            {isSaving ? <CircularProgress size={20} color="inherit" /> : 'Guardar cambios'}
          </Button>
        </Box>
      </Box>
    </ProfileSection>
  );
}

function ChangePasswordForm() {
  const { showSuccess, showError } = useSnackbar();
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const canSubmit = currentPassword && password && passwordConfirmation && password === passwordConfirmation;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.changePassword(currentPassword, password, passwordConfirmation);
      showSuccess('Contraseña actualizada');
      setCurrentPassword('');
      setPassword('');
      setPasswordConfirmation('');
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Error al cambiar contraseña');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ProfileSection title="Cambiar contraseña">
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Contraseña actual"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          autoComplete="current-password"
          required
          fullWidth
        />
        <Divider />
        <TextField
          label="Nueva contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
          fullWidth
        />
        <TextField
          label="Confirmar nueva contraseña"
          type="password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          autoComplete="new-password"
          required
          fullWidth
          error={!!passwordConfirmation && password !== passwordConfirmation}
          helperText={passwordConfirmation && password !== passwordConfirmation ? 'Las contraseñas no coinciden' : ''}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isSaving || !canSubmit}
          >
            {isSaving ? <CircularProgress size={20} color="inherit" /> : 'Cambiar contraseña'}
          </Button>
        </Box>
      </Box>
    </ProfileSection>
  );
}

function InfoTab() {
  return (
    <Stack spacing={3} sx={{ maxWidth: 600 }}>
      <PersonalInfoForm />
      <ChangePasswordForm />
    </Stack>
  );
}

// --- Tab 1: Avatar editor ---


interface AvatarSelectProps {
  label: string;
  value: string;
  options: readonly string[] | readonly { label: string; value: string }[];
  onChange: (value: string) => void;
}

function AvatarSelect({ label, value, options, onChange }: AvatarSelectProps) {
  const isLabelValue = typeof options[0] === 'object';
  return (
    <TextField
      select
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      size="small"
    >
      {options.map((opt) => {
        const val = typeof opt === 'string' ? opt : opt.value;
        const lbl = typeof opt === 'string' ? opt : opt.label;
        return (
          <MenuItem key={val} value={val}>
            {isLabelValue ? lbl : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {typeof opt !== 'string' && (
                  <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: `#${val}`, border: '1px solid', borderColor: 'divider' }} />
                )}
                {lbl}
              </Box>
            )}
          </MenuItem>
        );
      })}
    </TextField>
  );
}

function ColorSelect({ label, value, options, onChange }: AvatarSelectProps & { options: readonly { label: string; value: string }[] }) {
  return (
    <TextField
      select
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      size="small"
    >
      {options.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: `#${opt.value}`, border: '1px solid', borderColor: 'divider', flexShrink: 0 }} />
            {opt.label}
          </Box>
        </MenuItem>
      ))}
    </TextField>
  );
}

function AvatarTab() {
  const { user, refreshUser } = useAuth();
  const { showSuccess, showError } = useSnackbar();
  const [draft, setDraft] = useState<AvatarConfig>(user?.avatar ?? randomAvatar());
  const [isSaving, setIsSaving] = useState(false);

  if (!user) return null;

  const update = (field: keyof AvatarConfig, value: string | number) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Strip Strapi's runtime `id` and empty strings from optional enum fields
      const { top, clothing, eyes, eyebrows, mouth, skinColor, hairColor, clothesColor, facialHairColor, hatColor } = draft;
      const cleanAvatar: AvatarConfig = {
        top, clothing, eyes, eyebrows, mouth, skinColor, hairColor, clothesColor, facialHairColor, hatColor,
      };
      if (draft.accessories) cleanAvatar.accessories = draft.accessories;
      if (draft.accessoriesProbability != null) cleanAvatar.accessoriesProbability = draft.accessoriesProbability;
      if (draft.facialHair) cleanAvatar.facialHair = draft.facialHair;
      if (draft.facialHairProbability != null) cleanAvatar.facialHairProbability = draft.facialHairProbability;
      if (draft.clothingGraphic) cleanAvatar.clothingGraphic = draft.clothingGraphic;

      await api.updateAvatar(cleanAvatar);
      await refreshUser();
      showSuccess('Avatar actualizado');
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Error al guardar avatar');
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = JSON.stringify(draft) !== JSON.stringify(user.avatar);

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="flex-start">
      {/* Preview */}
      <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, position: 'sticky', top: 80, alignSelf: { md: 'flex-start' } }}>
        <UserAvatar avatar={draft} size={160} />
        <Typography variant="body2" color="text.secondary">Vista previa</Typography>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
          fullWidth
        >
          {isSaving ? <CircularProgress size={20} color="inherit" /> : 'Guardar avatar'}
        </Button>
      </Paper>

      {/* Form */}
      <Stack spacing={2} sx={{ flex: 1, maxWidth: 500 }}>
        <ProfileSection title="Cabeza y pelo">
          <Stack spacing={2}>
            <AvatarSelect label="Peinado" value={draft.top} options={AVATAR_OPTIONS.top} onChange={(v) => update('top', v)} />
            <ColorSelect label="Color de pelo" value={draft.hairColor} options={AVATAR_OPTIONS.hairColor} onChange={(v) => update('hairColor', v)} />
            {['hat', 'winterHat1', 'winterHat02', 'winterHat03', 'winterHat04'].includes(draft.top) && (
              <ColorSelect label="Color de gorro" value={draft.hatColor} options={AVATAR_OPTIONS.hatColor} onChange={(v) => update('hatColor', v)} />
            )}
            <AvatarSelect label="Vello facial" value={draft.facialHair ?? ''} options={['', ...AVATAR_OPTIONS.facialHair]} onChange={(v) => update('facialHair', v)} />
            {draft.facialHair && (
              <ColorSelect label="Color vello facial" value={draft.facialHairColor} options={AVATAR_OPTIONS.facialHairColor} onChange={(v) => update('facialHairColor', v)} />
            )}
            <AvatarSelect label="Accesorios" value={draft.accessories ?? ''} options={['', ...AVATAR_OPTIONS.accessories]} onChange={(v) => update('accessories', v)} />
          </Stack>
        </ProfileSection>

        <ProfileSection title="Cara">
          <Stack spacing={2}>
            <AvatarSelect label="Ojos" value={draft.eyes} options={AVATAR_OPTIONS.eyes} onChange={(v) => update('eyes', v)} />
            <AvatarSelect label="Cejas" value={draft.eyebrows} options={AVATAR_OPTIONS.eyebrows} onChange={(v) => update('eyebrows', v)} />
            <AvatarSelect label="Boca" value={draft.mouth} options={AVATAR_OPTIONS.mouth} onChange={(v) => update('mouth', v)} />
            <ColorSelect label="Color de piel" value={draft.skinColor} options={AVATAR_OPTIONS.skinColor} onChange={(v) => update('skinColor', v)} />
          </Stack>
        </ProfileSection>

        <ProfileSection title="Ropa">
          <Stack spacing={2}>
            <AvatarSelect label="Tipo de ropa" value={draft.clothing} options={AVATAR_OPTIONS.clothing} onChange={(v) => update('clothing', v)} />
            <ColorSelect label="Color de ropa" value={draft.clothesColor} options={AVATAR_OPTIONS.clothesColor} onChange={(v) => update('clothesColor', v)} />
            {draft.clothing === 'graphicShirt' && (
              <AvatarSelect label="Gráfico" value={draft.clothingGraphic ?? ''} options={AVATAR_OPTIONS.clothingGraphic} onChange={(v) => update('clothingGraphic', v)} />
            )}
          </Stack>
        </ProfileSection>
      </Stack>
    </Stack>
  );
}

// --- Tab 2: Availability calendar ---

function AvailabilityTab() {
  const { showSuccess, showError } = useSnackbar();
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(dayjs());

  // Form state
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data } = useQuery({
    queryKey: ['profile', 'viability'],
    queryFn: () => api.getMyViability(),
  });

  const { mutate: updateEvent, isPending: isUpdating } = useUpdateEvent();
  const { mutate: deleteEvent } = useDeleteEvent();
  const [isCreating, setIsCreating] = useState(false);
  const queryClient = useQueryClient();

  const events = data?.data ?? [];

  const blockedRanges: BlockedRange[] = events.map((event) => ({
    start: dayjs(event.StartDate as string),
    end: dayjs((event.EndDate as string) || (event.StartDate as string)),
    color: event.Status === 'Cancelled' ? 'action.disabled' : 'error.main',
  }));

  const resetForm = () => {
    setName('');
    setStartDate('');
    setEndDate('');
    setEditingId(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !startDate) return;

    if (editingId) {
      updateEvent(
        {
          id: editingId,
          body: {
            data: {
              Name: name,
              Type: 'Viability' as const,
              StartDate: startDate,
              EndDate: endDate || undefined,
              publishedAt: new Date().toISOString(),
            },
          },
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile', 'viability'] });
            showSuccess('Disponibilidad actualizada');
            resetForm();
          },
          onError: () => showError('Error al actualizar'),
        },
      );
    } else {
      setIsCreating(true);
      try {
        await api.createViability({ Name: name, StartDate: startDate, EndDate: endDate || undefined });
        queryClient.invalidateQueries({ queryKey: ['profile', 'viability'] });
        showSuccess('Disponibilidad creada');
        resetForm();
      } catch {
        showError('Error al crear');
      } finally {
        setIsCreating(false);
      }
    }
  };

  const handleEdit = (event: (typeof events)[number]) => {
    setEditingId(event.documentId);
    setName(event.Name);
    setStartDate(event.StartDate);
    setEndDate((event.EndDate as string) ?? '');
  };

  const handleDelete = (documentId: string) => {
    deleteEvent(documentId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['profile', 'viability'] });
        showSuccess('Disponibilidad eliminada');
      },
      onError: () => showError('Error al eliminar'),
    });
  };

  const isSaving = isCreating || isUpdating;
  const canSubmit = !!name && !!startDate && !isSaving;

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="flex-start">
      {/* Calendar */}
      <Box sx={{ position: 'sticky', top: 80, alignSelf: { md: 'flex-start' } }}>
        <Calendar
          value={selectedDate}
          onChange={setSelectedDate}
          blockedRanges={blockedRanges}
        />
      </Box>

      {/* Form + List */}
      <Stack spacing={3} sx={{ flex: 1, maxWidth: 500, width: '100%' }}>
        <ProfileSection title={editingId ? 'Editar disponibilidad' : 'Nueva disponibilidad'}>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Vacaciones, No disponible..."
              required
              fullWidth
              size="small"
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="Fecha inicio"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                fullWidth
                size="small"
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                label="Fecha fin"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                fullWidth
                size="small"
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Stack>
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              {editingId && (
                <Button variant="outlined" onClick={resetForm} startIcon={<CloseIcon />}>
                  Cancelar
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                disabled={!canSubmit}
                startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
              >
                {editingId ? 'Actualizar' : 'Crear'}
              </Button>
            </Stack>
          </Box>
        </ProfileSection>

        <ProfileSection title="Disponibilidades">
          {events.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No hay disponibilidades registradas.
            </Typography>
          ) : (
            <List disablePadding>
              {events.map((event) => (
                <ListItem
                  key={event.documentId}
                  disableGutters
                  secondaryAction={
                    <Stack direction="row" spacing={0.5}>
                      <IconButton size="small" onClick={() => handleEdit(event)} title="Editar">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(event.documentId)} title="Eliminar" color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  }
                  sx={{ borderBottom: '1px solid', borderColor: 'divider', py: 1 }}
                >
                  <ListItemText
                    primary={event.Name}
                    secondary={
                      event.EndDate
                        ? `${dayjs(event.StartDate).format('D MMM YYYY')} — ${dayjs(event.EndDate).format('D MMM YYYY')}`
                        : dayjs(event.StartDate).format('D MMM YYYY')
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </ProfileSection>
      </Stack>
    </Stack>
  );
}

// --- Page ---

const PROFILE_TABS = { availability: 0, info: 1, avatar: 2 } as const;
type ProfileTab = typeof PROFILE_TABS[keyof typeof PROFILE_TABS];

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const [tab, setTab] = useState<ProfileTab>(PROFILE_TABS.availability);

  if (isLoading || !user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <PageLayout
      header={
        <Stack direction="row" alignItems="center" spacing={2}>
          <UserAvatar avatar={user.avatar} size={48} />
          <Box>
            <Typography variant="h5">{user.displayName ?? user.username}</Typography>
            <Typography variant="body2" color="text.secondary">{user.email}</Typography>
          </Box>
        </Stack>
      }
    >
      <Box>
        <Tabs value={tab} onChange={(_, v: ProfileTab) => setTab(v)} sx={{ mb: 3 }}>
          <Tab icon={<CalendarMonthIcon />} label="Disponibilidad" />
          <Tab icon={<PersonIcon />} label="Información" />
          <Tab icon={<FaceIcon />} label="Avatar" />
        </Tabs>
        {tab === PROFILE_TABS.availability && <AvailabilityTab />}
        {tab === PROFILE_TABS.info && <InfoTab />}
        {tab === PROFILE_TABS.avatar && <AvatarTab />}
      </Box>
    </PageLayout>
  );
}

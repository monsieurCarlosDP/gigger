import { api } from '@/shared/api/client';
import type { AvatarConfig } from '@/shared/api/client';
import { useAuth } from '@/shared/context/AuthContext';
import { useSnackbar } from '@/shared/context/SnackbarContext';
import { PageLayout } from '@/shared/layouts/PageLayout';
import { UserAvatar } from '@/shared/components/UserAvatar';
import PersonIcon from '@mui/icons-material/Person';
import FaceIcon from '@mui/icons-material/Face';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  MenuItem,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import type { FormEvent } from 'react';

// --- Avatar option values (dicebear avataaars) ---

const AVATAR_OPTIONS = {
  top: [
    'hat', 'hijab', 'turban', 'winterHat1', 'winterHat02', 'winterHat03', 'winterHat04',
    'bob', 'bun', 'curly', 'curvy', 'dreads', 'frida', 'fro', 'froBand',
    'longButNotTooLong', 'miaWallace', 'shavedSides', 'straight02', 'straight01',
    'straightAndStrand', 'dreads01', 'dreads02', 'frizzle', 'shaggy', 'shaggyMullet',
    'shortCurly', 'shortFlat', 'shortRound', 'shortWaved', 'sides',
    'theCaesar', 'theCaesarAndSidePart', 'bigHair',
  ],
  accessories: [
    'kurt', 'prescription01', 'prescription02', 'round', 'sunglasses', 'wayfarers', 'eyepatch',
  ],
  facialHair: [
    'beardLight', 'beardMajestic', 'beardMedium', 'moustacheFancy', 'moustacheMagnum',
  ],
  clothing: [
    'blazerAndShirt', 'blazerAndSweater', 'collarAndSweater', 'graphicShirt',
    'hoodie', 'overall', 'shirtCrewNeck', 'shirtScoopNeck', 'shirtVNeck',
  ],
  clothingGraphic: [
    'bat', 'bear', 'cumbia', 'deer', 'diamond', 'hola', 'pizza', 'resist', 'skull', 'skullOutline',
  ],
  eyes: [
    'closed', 'cry', 'default', 'eyeRoll', 'happy', 'hearts', 'side',
    'squint', 'surprised', 'winkWacky', 'wink', 'xDizzy',
  ],
  eyebrows: [
    'angryNatural', 'defaultNatural', 'flatNatural', 'frownNatural',
    'raisedExcitedNatural', 'sadConcernedNatural', 'unibrowNatural',
    'upDownNatural', 'angry', 'default', 'raisedExcited', 'sadConcerned', 'upDown',
  ],
  mouth: [
    'concerned', 'default', 'disbelief', 'eating', 'grimace', 'sad',
    'screamOpen', 'serious', 'smile', 'tongue', 'twinkle', 'vomit',
  ],
  skinColor: [
    { label: 'Claro', value: 'ffdbb4' },
    { label: 'Medio claro', value: 'edb98a' },
    { label: 'Medio', value: 'd08b5b' },
    { label: 'Bronceado', value: 'fd9841' },
    { label: 'Oscuro', value: 'ae5d29' },
    { label: 'Muy oscuro', value: '614335' },
    { label: 'Amarillo', value: 'f8d25c' },
  ],
  hairColor: [
    { label: 'Castaño', value: 'a55728' },
    { label: 'Negro', value: '2c1b18' },
    { label: 'Rubio', value: 'b58143' },
    { label: 'Rubio dorado', value: 'd6b370' },
    { label: 'Marrón', value: '724133' },
    { label: 'Marrón oscuro', value: '4a312c' },
    { label: 'Rosa pastel', value: 'f59797' },
    { label: 'Platino', value: 'ecdcbf' },
    { label: 'Pelirrojo', value: 'c93305' },
    { label: 'Gris plata', value: 'e8e1e1' },
  ],
  clothesColor: [
    { label: 'Negro', value: '262e33' },
    { label: 'Azul claro', value: '65c9ff' },
    { label: 'Azul', value: '5199e4' },
    { label: 'Azul oscuro', value: '25557c' },
    { label: 'Gris claro', value: 'e6e6e6' },
    { label: 'Gris', value: '929598' },
    { label: 'Gris oscuro', value: '3c4f5c' },
    { label: 'Azul pastel', value: 'b1e2ff' },
    { label: 'Verde pastel', value: 'a7ffc4' },
    { label: 'Naranja pastel', value: 'ffdeb5' },
    { label: 'Rosa pastel', value: 'ffafb9' },
    { label: 'Amarillo pastel', value: 'ffffb1' },
    { label: 'Rosa', value: 'ff488e' },
    { label: 'Rojo', value: 'ff5c5c' },
    { label: 'Blanco', value: 'ffffff' },
  ],
} as const;

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

const DEFAULT_AVATAR: AvatarConfig = {
  top: 'shortFlat',
  clothing: 'blazerAndShirt',
  eyes: 'default',
  eyebrows: 'default',
  mouth: 'smile',
  skinColor: 'edb98a',
  hairColor: '4a312c',
  clothesColor: '929598',
  facialHairColor: '4a312c',
  hatColor: '929598',
};

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
  const [draft, setDraft] = useState<AvatarConfig>(user?.avatar ?? DEFAULT_AVATAR);
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

      await api.updateMe(user.id, { avatar: cleanAvatar });
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
            <AvatarSelect label="Vello facial" value={draft.facialHair ?? ''} options={['', ...AVATAR_OPTIONS.facialHair]} onChange={(v) => update('facialHair', v)} />
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

// --- Page ---

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const [tab, setTab] = useState(0);

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
        <Tabs value={tab} onChange={(_, v: number) => setTab(v)} sx={{ mb: 3 }}>
          <Tab icon={<PersonIcon />} label="Información" />
          <Tab icon={<FaceIcon />} label="Avatar" />
        </Tabs>
        {tab === 0 && <InfoTab />}
        {tab === 1 && <AvatarTab />}
      </Box>
    </PageLayout>
  );
}

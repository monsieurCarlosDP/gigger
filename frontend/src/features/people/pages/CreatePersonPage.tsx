import type { PersonFormState } from '@/features/people/hooks/usePersonForm';
import { useCreatePerson } from '@/features/people/hooks/usePeople';
import { useCreateTag, useTags } from '@/features/people/hooks/useTags';
import { usePersonForm } from '@/features/people/hooks/usePersonForm';
import { PageLayout } from '@/shared/layouts/PageLayout';
import { TagsField } from '@/shared/components/TagsField';
import { Modal } from '@/shared/components/Modal';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '@/shared/context/SnackbarContext';

const PERSON_TYPES = [
  { value: 'Client', label: 'Cliente' },
  { value: 'Provider', label: 'Proveedor' },
  { value: 'Manager', label: 'Gestor' },
] as const;

export default function CreatePersonPage() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const { mutateAsync: createPerson, isPending: isSaving } = useCreatePerson();
  const { mutateAsync: createTag, isPending: isCreatingTag } = useCreateTag();
  const { data: tagsData, isLoading: isLoadingTags } = useTags();

  const [form, dispatch] = usePersonForm({
    Name: '',
    Email: '',
    Number: '',
    Description: '',
    Type: '',
    tags: [],
  });

  const [newTagName, setNewTagName] = useState<string>('');
  const [newTagDescription, setNewTagDescription] = useState<string>('');
  const [newTagColor, setNewTagColor] = useState('#1976D2');
  const [openNewTagModal, setOpenNewTagModal] = useState(false);

  const formRef = useRef<(() => PersonFormState) | null>(null);
  formRef.current = () => form;

  const handleSave = useCallback(async () => {
    if (!formRef.current) return;
    const form = formRef.current();

    if (!form.Name.trim()) {
      showError('El nombre es obligatorio');
      return;
    }

    if (!form.Email.trim()) {
      showError('El email es obligatorio');
      return;
    }

    try {
      await createPerson({
        data: {
          Name: form.Name,
          Email: form.Email,
          Number: form.Number || undefined,
          Description: form.Description || undefined,
          Type: form.Type || undefined,
          publishedAt: new Date().toISOString(),
          tags: form.tags.map((t) => t.documentId),
        },
      });

      showSuccess('Persona creada correctamente');
      navigate('/people');
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Error al crear persona');
    }
  }, [createPerson, navigate, showSuccess, showError]);

  const handleCancel = () => {
    navigate('/people');
  };

  const handleOpenCreateTagModal = useCallback((tagName: string) => {
    setNewTagName(tagName);
    setNewTagDescription('');
    setNewTagColor('#1976D2');
    setOpenNewTagModal(true);
  }, []);

  const handleCreateTag = useCallback(async () => {
    try {
      const payload = {
        data: {
          Name: newTagName,
          Description: newTagDescription || undefined,
          Color: newTagColor,
          publishedAt: new Date().toISOString(),
        },
      };
      const newTag = await createTag(payload);

      if (newTag?.data) {
        dispatch({
          type: 'SET_TAGS',
          tags: [...form.tags, newTag.data],
        });
        showSuccess(`Etiqueta "${newTagName}" creada correctamente`);
        setOpenNewTagModal(false);
        setNewTagName('');
        setNewTagDescription('');
        setNewTagColor('#1976D2');
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Error al crear etiqueta');
    }
  }, [newTagName, newTagDescription, newTagColor, createTag, form.tags, dispatch, showSuccess, showError]);

  const allTags = tagsData?.data ?? [];

  return (
    <PageLayout
      header={
        <Stack direction="row" alignItems="center" gap={1}>
          <IconButton onClick={handleCancel} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {form.Name.trim() || 'Crear Persona'}
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
      <Box sx={{ maxWidth: 700, mx: 'auto', width: '100%' }}>
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
                onChange={(e) =>
                  dispatch({ type: 'SET_FIELD', field: 'Name', value: e.target.value })
                }
                placeholder="Ej: Juan García"
              />

              <TextField
                label="Email"
                required
                type="email"
                fullWidth
                value={form.Email}
                onChange={(e) =>
                  dispatch({ type: 'SET_FIELD', field: 'Email', value: e.target.value })
                }
                placeholder="ej: juan@example.com"
              />

              <TextField
                label="Teléfono"
                fullWidth
                value={form.Number}
                onChange={(e) =>
                  dispatch({ type: 'SET_FIELD', field: 'Number', value: e.target.value })
                }
                placeholder="Ej: +34 666 555 444"
              />

              <TextField
                label="Descripción"
                fullWidth
                multiline
                rows={3}
                value={form.Description}
                onChange={(e) =>
                  dispatch({
                    type: 'SET_FIELD',
                    field: 'Description',
                    value: e.target.value,
                  })
                }
                placeholder="Información adicional sobre la persona..."
              />

              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={form.Type}
                  label="Tipo"
                  onChange={(e) =>
                    dispatch({
                      type: 'SET_FIELD',
                      field: 'Type',
                      value: e.target.value,
                    })
                  }
                >
                  <MenuItem value="">—</MenuItem>
                  {PERSON_TYPES.map((t) => (
                    <MenuItem key={t.value} value={t.value}>
                      {t.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Paper>

          <Paper elevation={2} sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Typography variant="h6">Etiquetas</Typography>
              <Divider />

              <TagsField
                value={form.tags}
                onChange={(tags) => dispatch({ type: 'SET_TAGS', tags })}
                availableTags={allTags}
                loading={isLoadingTags || isCreatingTag}
                onCreateNew={handleOpenCreateTagModal}
                placeholder="Buscar o crear etiquetas..."
              />
            </Stack>
          </Paper>

          {/* Modal para crear nuevo tag */}
          <Modal
            open={openNewTagModal}
            onClose={() => {
              setOpenNewTagModal(false);
              setNewTagName('');
              setNewTagDescription('');
              setNewTagColor('#1976D2');
            }}
            title={`Crear etiqueta: "${newTagName}"`}
            onConfirm={handleCreateTag}
            confirmText="Crear"
            cancelText="Cancelar"
            isLoading={isCreatingTag}
            maxWidth="sm"
            fullWidth
          >
            <Stack spacing={2}>
              <TextField
                label="Nombre"
                fullWidth
                size="small"
                value={newTagName}
                disabled
                helperText="El nombre se define al crear la etiqueta desde el campo de tags"
              />
              <TextField
                label="Descripción (opcional)"
                fullWidth
                multiline
                rows={3}
                size="small"
                placeholder="Añade una descripción para esta etiqueta..."
                value={newTagDescription}
                onChange={(e) => setNewTagDescription(e.target.value)}
                disabled={isCreatingTag}
              />
              <Box>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  Color
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <input
                    type="color"
                    value={newTagColor}
                    onChange={(e) => setNewTagColor(e.target.value)}
                    disabled={isCreatingTag}
                    style={{
                      width: 50,
                      height: 40,
                      border: 'none',
                      borderRadius: 4,
                      cursor: isCreatingTag ? 'not-allowed' : 'pointer',
                    }}
                  />
                  <TextField
                    label="Código hexadecimal"
                    size="small"
                    value={newTagColor}
                    onChange={(e) => setNewTagColor(e.target.value)}
                    disabled={isCreatingTag}
                    placeholder="#1976D2"
                    sx={{ flex: 1 }}
                  />
                </Box>
              </Box>
            </Stack>
          </Modal>
        </Stack>
      </Box>
    </PageLayout>
  );
}

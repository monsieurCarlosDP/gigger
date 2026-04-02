import type { Tag } from '@/shared/api/client';
import type { PersonFormState } from '@/features/people/hooks/usePersonForm';
import { useUpdatePerson, usePersonById } from '@/features/people/hooks/usePeople';
import { useCreateTag, useTags } from '@/features/people/hooks/useTags';
import { usePersonForm } from '@/features/people/hooks/usePersonForm';
import { PageLayout } from '@/shared/layouts/PageLayout';
import { TagsField } from '@/shared/components/TagsField';
import { Modal } from '@/shared/components/Modal';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Box,
  Button,
  CircularProgress,
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
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from '@/shared/context/SnackbarContext';

const PERSON_TYPES = [
  { value: 'Client', label: 'Cliente' },
  { value: 'Provider', label: 'Proveedor' },
  { value: 'Manager', label: 'Gestor' },
] as const;

export default function EditPersonPage() {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const { mutateAsync: updatePerson, isPending: isSaving } = useUpdatePerson();
  const { mutateAsync: createTag, isPending: isCreatingTag } = useCreateTag();
  const { data: personData, isLoading: isLoadingPerson } = usePersonById(documentId);
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

  const person = personData?.data;
  const allTags = tagsData?.data ?? [];

  // Cargar datos de la persona cuando estén disponibles
  useEffect(() => {
    if (person) {
      dispatch({ type: 'SET_FIELD', field: 'Name', value: person.Name });
      dispatch({ type: 'SET_FIELD', field: 'Email', value: person.Email });
      dispatch({ type: 'SET_FIELD', field: 'Number', value: person.Number || '' });
      dispatch({
        type: 'SET_FIELD',
        field: 'Description',
        value: person.Description || '',
      });
      dispatch({ type: 'SET_FIELD', field: 'Type', value: person.Type || '' });
      dispatch({ type: 'SET_TAGS', tags: (person.tags || []) as Tag[] });
    }
  }, [person, dispatch]);

  const handleSave = useCallback(async () => {
    if (!formRef.current || !documentId) return;
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
      await updatePerson({
        id: documentId,
        body: {
          data: {
            Name: form.Name,
            Email: form.Email,
            Number: form.Number || undefined,
            Description: form.Description || undefined,
            Type: form.Type || undefined,
            tags: form.tags.map((t) => t.documentId),
          },
        },
      });

      showSuccess('Persona actualizada correctamente');
      navigate('/people');
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Error al actualizar persona');
    }
  }, [updatePerson, documentId, navigate, showSuccess, showError]);

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

  if (isLoadingPerson) {
    return (
      <PageLayout
        header={
          <Stack direction="row" alignItems="center" gap={1}>
            <IconButton onClick={handleCancel} size="small">
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Cargando...
            </Typography>
          </Stack>
        }
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}>
          <CircularProgress />
        </Box>
      </PageLayout>
    );
  }

  if (!person) {
    return (
      <PageLayout
        header={
          <Stack direction="row" alignItems="center" gap={1}>
            <IconButton onClick={handleCancel} size="small">
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Persona no encontrada
            </Typography>
          </Stack>
        }
      >
        <Typography color="textSecondary">La persona no existe</Typography>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      header={
        <Stack direction="row" alignItems="center" gap={1}>
          <IconButton onClick={handleCancel} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {form.Name.trim() || 'Editar Persona'}
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

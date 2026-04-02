import { useCreatePerson } from '@/features/people/hooks/usePeople';
import { useCreateTag, useTags } from '@/features/people/hooks/useTags';
import type { PersonFormState } from '@/features/people/hooks/usePersonForm';
import { usePersonForm } from '@/features/people/hooks/usePersonForm';
import { Modal } from '@/shared/components/Modal';
import { TagsField } from '@/shared/components/TagsField';
// Modal se sigue usando para el modal principal de crear persona
import { useSnackbar } from '@/shared/context/SnackbarContext';
import {
  Box,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback, useRef, useState } from 'react';

const PERSON_TYPES = [
  { value: 'Client', label: 'Cliente' },
  { value: 'Provider', label: 'Proveedor' },
  { value: 'Manager', label: 'Gestor' },
] as const;

export interface CreatePersonModalProps {
  open: boolean;
  onClose: () => void;
  onPersonCreated?: (person: any) => void;
}

/**
 * Modal para crear una nueva persona on-the-fly
 * Se reutiliza en eventos, calendarios, etc.
 */
export function CreatePersonModal({
  open,
  onClose,
  onPersonCreated,
}: CreatePersonModalProps) {
  const { showSuccess, showError } = useSnackbar();
  const { mutateAsync: createPerson, isPending: isSaving } = useCreatePerson();
  const { mutateAsync: createTag, isPending: isCreatingTag } = useCreateTag();
  const { data: tagsData, isLoading: isLoadingTags, refetch: refetchTags } = useTags();

  const [form, dispatch] = usePersonForm({
    Name: '',
    Email: '',
    Number: '',
    Description: '',
    Type: '',
    tags: [],
  });

  // Estado para el Modal de crear nuevo tag
  const [newTagName, setNewTagName] = useState('');
  const [newTagDescription, setNewTagDescription] = useState('');
  const [newTagColor, setNewTagColor] = useState('#1976D2');
  const [openNewTagModal, setOpenNewTagModal] = useState(false);

  const formRef = useRef<(() => PersonFormState) | null>(null);
  formRef.current = () => form;

  const allTags = tagsData?.data ?? [];

  const handleSave = useCallback(async () => {
    if (!formRef.current) return;
    const currentForm = formRef.current();

    if (!currentForm.Name.trim()) {
      showError('El nombre es obligatorio');
      return;
    }

    if (!currentForm.Email.trim()) {
      showError('El email es obligatorio');
      return;
    }

    try {
      const newPerson = await createPerson({
        data: {
          Name: currentForm.Name,
          Email: currentForm.Email,
          Number: currentForm.Number || undefined,
          Description: currentForm.Description || undefined,
          Type: currentForm.Type || undefined,
          publishedAt: new Date().toISOString(),
          tags: currentForm.tags.map((t) => t.documentId),
        },
      });

      showSuccess('Persona creada correctamente');

      if (newPerson?.data) {
        onPersonCreated?.(newPerson.data);
      }

      // Reset form
      dispatch({ type: 'SET_FIELD', field: 'Name', value: '' });
      dispatch({ type: 'SET_FIELD', field: 'Email', value: '' });
      dispatch({ type: 'SET_FIELD', field: 'Number', value: '' });
      dispatch({ type: 'SET_FIELD', field: 'Description', value: '' });
      dispatch({ type: 'SET_FIELD', field: 'Type', value: '' });
      dispatch({ type: 'SET_TAGS', tags: [] });

      onClose();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Error al crear persona');
    }
  }, [createPerson, showSuccess, showError, onClose, onPersonCreated, dispatch]);

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
        await refetchTags();
        showSuccess(`Etiqueta "${newTagName}" creada`);
        setOpenNewTagModal(false);
        setNewTagName('');
        setNewTagDescription('');
        setNewTagColor('#1976D2');
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Error al crear etiqueta');
    }
  }, [newTagName, newTagDescription, newTagColor, createTag, form.tags, dispatch, refetchTags, showSuccess, showError]);

  const isLoading = isSaving || isCreatingTag;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Crear nueva persona"
      onConfirm={handleSave}
      confirmText="Crear"
      cancelText="Cancelar"
      isLoading={isLoading}
      maxWidth="sm"
      fullWidth
    >
      <Stack spacing={2}>
        <TextField
          label="Nombre"
          required
          fullWidth
          size="small"
          value={form.Name}
          onChange={(e) =>
            dispatch({ type: 'SET_FIELD', field: 'Name', value: e.target.value })
          }
          placeholder="Ej: Juan García"
          disabled={isLoading}
        />

        <TextField
          label="Email"
          required
          type="email"
          fullWidth
          size="small"
          value={form.Email}
          onChange={(e) =>
            dispatch({ type: 'SET_FIELD', field: 'Email', value: e.target.value })
          }
          placeholder="ej: juan@example.com"
          disabled={isLoading}
        />

        <TextField
          label="Teléfono"
          fullWidth
          size="small"
          value={form.Number}
          onChange={(e) =>
            dispatch({ type: 'SET_FIELD', field: 'Number', value: e.target.value })
          }
          placeholder="Ej: +34 666 555 444"
          disabled={isLoading}
        />

        <TextField
          label="Descripción"
          fullWidth
          multiline
          rows={2}
          size="small"
          value={form.Description}
          onChange={(e) =>
            dispatch({
              type: 'SET_FIELD',
              field: 'Description',
              value: e.target.value,
            })
          }
          placeholder="Información adicional..."
          disabled={isLoading}
        />

        <FormControl fullWidth size="small">
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
            disabled={isLoading}
          >
            <MenuItem value="">—</MenuItem>
            {PERSON_TYPES.map((t) => (
              <MenuItem key={t.value} value={t.value}>
                {t.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Divider />

        {/* Etiquetas */}
        <Stack spacing={1}>
          <Typography variant="subtitle2" fontWeight={600}>
            Etiquetas
          </Typography>
          <TagsField
            value={form.tags}
            onChange={(tags) => dispatch({ type: 'SET_TAGS', tags })}
            availableTags={allTags}
            loading={isLoadingTags}
            onCreateNew={handleOpenCreateTagModal}
            placeholder="Buscar o crear etiquetas..."
          />
        </Stack>
      </Stack>

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
    </Modal>
  );
}

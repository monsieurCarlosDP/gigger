import { usePersonById, useUpdatePerson } from '@/features/people/hooks/usePeople';
import { Box, CircularProgress, Divider, FormControl, MenuItem, Select, Stack, TextField, Typography, Chip, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { useCallback, useState } from 'react';
import { useSnackbar } from '@/shared/context/SnackbarContext';

interface PersonDetailDrawerViewProps {
  id: string;
}

export function PersonDetailDrawerView({ id }: PersonDetailDrawerViewProps) {
  const { showSuccess, showError } = useSnackbar();
  const { data: personData, isLoading, refetch } = usePersonById(id);
  const { mutateAsync: updatePerson, isPending: isSaving } = useUpdatePerson();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const person = personData?.data;

  // Initialize edit data when person loads
  const handleEditClick = useCallback(() => {
    if (person) {
      setEditData({
        Name: person.Name || '',
        Email: person.Email || '',
        Number: person.Number || '',
        Type: person.Type || '',
        Description: person.Description || '',
      });
      setIsEditing(true);
    }
  }, [person]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setEditData(null);
  }, []);

  const handleSave = useCallback(async () => {
    if (!editData || !editData.Name.trim()) {
      showError('El nombre es obligatorio');
      return;
    }

    if (!editData.Email.trim()) {
      showError('El email es obligatorio');
      return;
    }

    try {
      await updatePerson({
        id,
        body: {
          data: {
            Name: editData.Name,
            Email: editData.Email,
            Number: editData.Number || undefined,
            Type: editData.Type || undefined,
            Description: editData.Description || undefined,
          },
        },
      });

      showSuccess('Persona actualizada correctamente');
      setIsEditing(false);
      setEditData(null);
      await refetch();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Error al actualizar persona');
    }
  }, [editData, id, updatePerson, showSuccess, showError, refetch]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!person) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Persona no encontrada</Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
          <Typography variant="h6" fontWeight={600} sx={{ flex: 1 }}>
            {isEditing ? editData?.Name : person.Name}
          </Typography>
          <Stack direction="row" gap={0.5}>
            {isEditing ? (
              <>
                <IconButton
                  size="small"
                  onClick={handleSave}
                  disabled={isSaving}
                  color="primary"
                  title="Guardar"
                >
                  <SaveIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={handleCancel}
                  disabled={isSaving}
                  title="Cancelar"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </>
            ) : (
              <IconButton
                size="small"
                onClick={handleEditClick}
                color="primary"
                title="Editar"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>
        </Stack>
        <Divider />
      </Stack>

      <Stack spacing={2}>
        <Box>
          <Typography variant="caption" color="textSecondary">
            Email
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={isEditing ? editData?.Email : person.Email || ''}
            onChange={(e) => isEditing && setEditData({ ...editData, Email: e.target.value })}
            disabled={!isEditing}
            variant={isEditing ? 'outlined' : 'standard'}
            sx={{ mt: 0.5 }}
          />
        </Box>

        <Box>
          <Typography variant="caption" color="textSecondary">
            Teléfono
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={isEditing ? editData?.Number : person.Number || '—'}
            onChange={(e) => isEditing && setEditData({ ...editData, Number: e.target.value })}
            disabled={!isEditing}
            variant={isEditing ? 'outlined' : 'standard'}
            sx={{ mt: 0.5 }}
          />
        </Box>

        <Box>
          <Typography variant="caption" color="textSecondary">
            Tipo
          </Typography>
          {isEditing ? (
            <FormControl fullWidth size="small" sx={{ mt: 0.5 }}>
              <Select
                value={editData?.Type || ''}
                onChange={(e) => setEditData({ ...editData, Type: e.target.value })}
              >
                <MenuItem value="">—</MenuItem>
                <MenuItem value="Client">Cliente</MenuItem>
                <MenuItem value="Provider">Proveedor</MenuItem>
                <MenuItem value="Manager">Gestor</MenuItem>
              </Select>
            </FormControl>
          ) : (
            <TextField
              fullWidth
              size="small"
              value={
                person.Type === 'Client'
                  ? 'Cliente'
                  : person.Type === 'Provider'
                    ? 'Proveedor'
                    : person.Type === 'Manager'
                      ? 'Gestor'
                      : '—'
              }
              disabled
              variant="standard"
              sx={{ mt: 0.5 }}
            />
          )}
        </Box>

        <Box>
          <Typography variant="caption" color="textSecondary">
            Descripción
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={isEditing ? editData?.Description : person.Description || ''}
            onChange={(e) => isEditing && setEditData({ ...editData, Description: e.target.value })}
            disabled={!isEditing}
            multiline
            rows={3}
            variant={isEditing ? 'outlined' : 'standard'}
            sx={{ mt: 0.5 }}
          />
        </Box>
      </Stack>

      {person.tags && person.tags.length > 0 && (
        <Stack spacing={2}>
          <Typography variant="subtitle2" fontWeight={600}>
            Etiquetas
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {person.tags.map((tag: any) => (
              <Chip
                key={tag.documentId || tag.id}
                label={tag.Name}
                size="small"
                sx={{
                  bgcolor: tag.Color ? `${tag.Color}20` : undefined,
                  color: tag.Color || undefined,
                  borderColor: tag.Color || undefined,
                }}
              />
            ))}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}

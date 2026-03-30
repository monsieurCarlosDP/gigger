import { usePeople, useDeletePerson } from '@/features/people/hooks/usePeople';
import { useTags } from '@/features/people/hooks/useTags';
import { DataTable } from '@/shared/components/DataTable';
import type { ColumnDef } from '@/shared/components/DataTable';
import { PopperButton } from '@/shared/components/PopperButton';
import { PageLayout } from '@/shared/layouts/PageLayout';
import { useDrawerNav } from '@/shared/context/DrawerContext';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Checkbox, Chip, FormControlLabel, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '@/shared/context/SnackbarContext';

type PersonRow = NonNullable<ReturnType<typeof usePeople>['data']>['data'][number];
type PersonType = 'Client' | 'Provider' | 'Manager';

const PERSON_TYPES: { value: PersonType; label: string }[] = [
  { value: 'Client', label: 'Cliente' },
  { value: 'Provider', label: 'Proveedor' },
  { value: 'Manager', label: 'Gestor' },
];

const getColumns = (onEdit: (id: string) => void, onDelete: (id: string) => void): ColumnDef<PersonRow>[] => [
  {
    key: 'name',
    header: 'Nombre',
    sortValue: (row) => row.Name?.toLowerCase() ?? '',
    render: (row) => (
      <Typography variant="body2" fontWeight={500}>
        {row.Name ?? '—'}
      </Typography>
    ),
  },
  {
    key: 'type',
    header: 'Tipo',
    render: (row) => {
      if (!row.Type) return null;
      const config: Record<string, { label: string; color: 'primary' | 'secondary' | 'info' }> = {
        Client: { label: 'Cliente', color: 'primary' },
        Provider: { label: 'Proveedor', color: 'secondary' },
        Manager: { label: 'Gestor', color: 'info' },
      };
      const c = config[row.Type];
      return c ? <Chip label={c.label} color={c.color} size="small" variant="outlined" /> : null;
    },
  },
  {
    key: 'email',
    header: 'Email',
    render: (row) => (
      <Typography variant="body2" color="text.secondary">
        {row.Email ?? '—'}
      </Typography>
    ),
  },
  {
    key: 'number',
    header: 'Teléfono',
    render: (row) => (
      <Typography variant="body2" color="text.secondary">
        {row.Number ?? '—'}
      </Typography>
    ),
  },
  {
    key: 'description',
    header: 'Descripción',
    render: (row) => (
      <Typography variant="body2" color="text.secondary">
        {row.Description ?? '—'}
      </Typography>
    ),
  },
  {
    key: 'tags',
    header: 'Etiquetas',
    render: (row) => {
      if (!row.tags || row.tags.length === 0) return null;
      return (
        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
          {row.tags.map((tag) => (
            <Chip
              key={tag.documentId}
              label={tag.Name}
              size="small"
              variant="outlined"
              sx={{
                backgroundColor: tag.Color ?? '#1976D2',
                borderColor: tag.Color ?? '#1976D2',
                color: '#fff',
                '& .MuiChip-label': { color: '#fff' },
              }}
            />
          ))}
        </Stack>
      );
    },
  },
  {
    key: 'actions',
    header: 'Acciones',
    render: (row) => (
      <Stack direction="row" spacing={1}>
        <IconButton
          size="small"
          onClick={(e) => { e.stopPropagation(); onEdit(row.documentId); }}
          title="Editar"
          color="primary"
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={(e) => { e.stopPropagation(); onDelete(row.documentId); }}
          title="Eliminar"
          color="error"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Stack>
    ),
  },
];

export default function PeoplePage() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const { openPersonDrawer } = useDrawerNav();
  const { data, isLoading } = usePeople();
  const { data: tagsData } = useTags();
  const { mutateAsync: deletePerson } = useDeletePerson();
  const [search, setSearch] = useState('');
  const [typeFilters, setTypeFilters] = useState<Set<PersonType>>(new Set(['Client', 'Provider', 'Manager']));
  const [tagFilters, setTagFilters] = useState<Set<string>>(new Set());

  const rows = data?.data ?? [];
  const allTags = tagsData?.data ?? [];

  const toggleType = (type: PersonType) => {
    setTypeFilters((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const toggleTag = (tagId: string) => {
    setTagFilters((prev) => {
      const next = new Set(prev);
      if (next.has(tagId)) next.delete(tagId);
      else next.add(tagId);
      return next;
    });
  };

  const handleEdit = (id: string) => {
    navigate(`/people/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta persona?')) {
      try {
        await deletePerson(id);
        showSuccess('Persona eliminada correctamente');
      } catch (err) {
        showError(err instanceof Error ? err.message : 'Error al eliminar persona');
      }
    }
  };

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      // Type filter
      if (row.Type && !typeFilters.has(row.Type as PersonType)) return false;
      // Tag filter
      if (tagFilters.size > 0) {
        const rowTagIds = new Set(row.tags?.map((t) => t.documentId) ?? []);
        const hasMatchingTag = Array.from(tagFilters).some((tagId) => rowTagIds.has(tagId));
        if (!hasMatchingTag) return false;
      }
      // Search
      const term = search.toLowerCase().trim();
      if (!term) return true;
      return (
        row.Name?.toLowerCase().includes(term) ||
        row.Email?.toLowerCase().includes(term) ||
        row.Number?.includes(term) ||
        row.Description?.toLowerCase().includes(term)
      );
    });
  }, [rows, search, typeFilters, tagFilters]);

  return (
    <PageLayout
      header={
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{ width: '100%' }}>
          <Typography variant="h6">Personas</Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/people/new')}
            >
              Crear
            </Button>
            <TextField
              placeholder="Buscar por nombre, email, teléfono..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ maxWidth: 400, minWidth: 200 }}
            />
            <PopperButton
              label="Tipo"
              buttonProps={{ variant: 'outlined', size: 'small', startIcon: <FilterListIcon /> }}
            >
              <Stack sx={{ p: 2, minWidth: 140 }}>
                {PERSON_TYPES.map((t) => (
                  <FormControlLabel
                    key={t.value}
                    control={
                      <Checkbox
                        size="small"
                        checked={typeFilters.has(t.value)}
                        onChange={() => toggleType(t.value)}
                      />
                    }
                    label={t.label}
                  />
                ))}
              </Stack>
            </PopperButton>
            {allTags.length > 0 && (
              <PopperButton
                label="Etiquetas"
                buttonProps={{ variant: 'outlined', size: 'small', startIcon: <FilterListIcon /> }}
              >
                <Stack sx={{ p: 2, minWidth: 180, maxHeight: 300, overflowY: 'auto' }}>
                  {allTags.map((tag) => (
                    <FormControlLabel
                      key={tag.documentId}
                      control={
                        <Checkbox
                          size="small"
                          checked={tagFilters.has(tag.documentId)}
                          onChange={() => toggleTag(tag.documentId)}
                        />
                      }
                      label={
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="body2">{tag.Name}</Typography>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '2px',
                              backgroundColor: tag.Color ?? '#1976D2',
                            }}
                          />
                        </Stack>
                      }
                    />
                  ))}
                </Stack>
              </PopperButton>
            )}
          </Stack>
        </Stack>
      }
    >
      <DataTable
        columns={getColumns(handleEdit, handleDelete)}
        rows={filteredRows}
        getRowKey={(row) => row.documentId}
        isLoading={isLoading}
        emptyMessage={search ? 'Sin resultados' : 'No hay personas'}
        onRowClick={(row) => openPersonDrawer(row.documentId)}
      />
    </PageLayout>
  );
}

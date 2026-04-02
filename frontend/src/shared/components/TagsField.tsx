import type { Tag } from '@/shared/api/client';
import AddIcon from '@mui/icons-material/Add';
import {
  Autocomplete,
  Box,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';

interface TagsFieldProps {
  value: Tag[];
  onChange: (tags: Tag[]) => void;
  availableTags: Tag[];
  loading?: boolean;
  error?: string;
  disabled?: boolean;
  onCreateNew?: (tagName: string) => void;
  placeholder?: string;
  helperText?: string;
}

export function TagsField({
  value,
  onChange,
  availableTags,
  loading = false,
  error,
  disabled = false,
  onCreateNew,
  placeholder = 'Buscar o crear tags...',
  helperText,
}: TagsFieldProps) {
  const [inputValue, setInputValue] = useState('');

  // Identificar si el valor actual es nuevo (no existe en availableTags)
  const isNewTag = inputValue.trim() && !availableTags.some((t) => t.Name.toLowerCase() === inputValue.toLowerCase());

  const handleTagChange = (_event: unknown, newValue: Tag[]) => {
    onChange(newValue);
    setInputValue('');
  };

  const handleInputChange = (_event: unknown, newInputValue: string) => {
    setInputValue(newInputValue);
  };

  const handleRemoveTag = (indexToRemove: number) => {
    const newTags = value.filter((_, index) => index !== indexToRemove);
    onChange(newTags);
  };

  // Mostrar un chip para el nuevo tag si existe input
  const displayTags = useMemo(() => {
    if (inputValue.trim() && isNewTag) {
      return [...availableTags, { Name: inputValue.trim() } as Tag];
    }
    return availableTags;
  }, [availableTags, inputValue, isNewTag]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1 }}>
          <Autocomplete<Tag, true, false, false>
            multiple
            size="small"
            options={displayTags}
            getOptionLabel={(option) => option.Name}
            value={value}
            onChange={(event, newValue) => handleTagChange(event, newValue as Tag[])}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => handleInputChange(event, newInputValue)}
            disabled={disabled || loading}
            loading={loading}
            isOptionEqualToValue={(option, val) =>
              option.Name === val.Name && (option.documentId === val.documentId || option.id === val.id)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={placeholder}
                error={!!error}
                helperText={error || helperText}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderValue={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Tooltip
                  key={`${option.Name}-${option.documentId || option.id || index}`}
                  title={option.Description || 'Sin descripción'}
                  arrow
                >
                  <Chip
                    {...getTagProps({ index })}
                    label={option.Name}
                    onDelete={() => handleRemoveTag(index)}
                    variant="outlined"
                    size="small"
                  />
                </Tooltip>
              ))
            }
            noOptionsText={
              isNewTag ? `Crear "${inputValue.trim()}" (usa el botón +)` : 'Sin tags disponibles'
            }
            filterOptions={(options, state) => {
              const filtered = options.filter((option) =>
                option.Name.toLowerCase().includes(state.inputValue.toLowerCase())
              );
              return filtered;
            }}
            ListboxProps={{
              sx: {
                '& li': {
                  '& [data-focus]': {
                    backgroundColor: 'action.hover',
                  },
                },
              },
            }}
            slotProps={{
              popper: {
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, 8],
                    },
                  },
                ],
              },
            }}
            freeSolo={false}
            PaperComponent={(props) => (
              <Paper {...props}>
                <Stack spacing={1}>
                  {props.children}
                  {isNewTag && onCreateNew && (
                    <Box
                      sx={{
                        p: 1,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'action.hover',
                      }}
                    >
                      <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1 }}>
                        Crear nuevo tag:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                          label={`+ ${inputValue.trim()}`}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onCreateNew(inputValue.trim());
                            setInputValue('');
                          }}
                          variant="outlined"
                          icon={<AddIcon sx={{ fontSize: 16 }} />}
                          size="small"
                          sx={{ cursor: 'pointer' }}
                        />
                      </Box>
                    </Box>
                  )}
                </Stack>
              </Paper>
            )}
          />
        </Box>
      </Box>
    </Box>
  );
}

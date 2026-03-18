import type { Meta, StoryObj } from '@storybook/react';
import { Box, Checkbox, FormControlLabel, List, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { PopperButton } from './PopperButton';

const meta: Meta<typeof PopperButton> = {
  title: 'Shared/PopperButton',
  component: PopperButton,
  decorators: [(Story) => <Box sx={{ p: 4 }}><Story /></Box>],
};

export default meta;
type Story = StoryObj<typeof PopperButton>;

export const Default: Story = {
  args: {
    label: 'Abrir',
    children: (
      <Box sx={{ p: 2, minWidth: 200 }}>
        <Typography variant="body2">Contenido del popper</Typography>
      </Box>
    ),
  },
};

export const WithCloseCallback: Story = {
  render: () => (
    <PopperButton label="Opciones" buttonProps={{ variant: 'outlined', size: 'small' }}>
      {(close) => (
        <List dense disablePadding sx={{ minWidth: 180 }}>
          {['Opción 1', 'Opción 2', 'Opción 3'].map((opt) => (
            <ListItemButton key={opt} onClick={close}>
              <ListItemText primary={opt} />
            </ListItemButton>
          ))}
        </List>
      )}
    </PopperButton>
  ),
};

export const FilterExample: Story = {
  render: () => (
    <PopperButton
      label="Filtrar"
      buttonProps={{ variant: 'outlined', size: 'small', startIcon: <FilterListIcon /> }}
    >
      <Stack sx={{ p: 2, minWidth: 200 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Tipo de evento</Typography>
        {['Reserva', 'Evento', 'Disponibilidad'].map((type) => (
          <FormControlLabel
            key={type}
            control={<Checkbox size="small" defaultChecked />}
            label={type}
          />
        ))}
      </Stack>
    </PopperButton>
  ),
};

export const Placements: Story = {
  render: () => (
    <Stack direction="row" spacing={2} sx={{ mt: 8 }}>
      {(['bottom-start', 'bottom', 'bottom-end'] as const).map((placement) => (
        <PopperButton
          key={placement}
          label={placement}
          placement={placement}
          buttonProps={{ variant: 'outlined', size: 'small' }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="body2">{placement}</Typography>
          </Box>
        </PopperButton>
      ))}
    </Stack>
  ),
};

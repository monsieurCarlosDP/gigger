import { Box, TextField, Typography } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Modal } from './Modal';

const meta: Meta<typeof Modal> = {
  title: 'Organisms/Modal',
  component: Modal,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Basic: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)}>Abrir Modal</button>
        <Modal open={open} onClose={() => setOpen(false)} title="Mi Modal">
          <Typography>Este es un contenido simple en el modal</Typography>
        </Modal>
      </>
    );
  },
};

export const WithForm: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '' });

    const handleConfirm = async () => {
      console.log('Confirmar:', formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    };

    return (
      <>
        <button onClick={() => setOpen(true)}>Crear Persona</button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Crear nueva persona"
          onConfirm={handleConfirm}
          confirmText="Crear"
          cancelText="Cancelar"
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nombre"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              label="Email"
              fullWidth
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </Box>
        </Modal>
      </>
    );
  },
};

export const NoActions: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)}>Ver información</button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Información"
          showActions={false}
        >
          <Typography>Este modal solo muestra información, sin acciones</Typography>
        </Modal>
      </>
    );
  },
};

export const Large: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)}>Modal grande</button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Modal de tamaño grande"
          maxWidth="md"
        >
          <Box sx={{ minHeight: 300 }}>
            <Typography>Este es un modal más grande con maxWidth="md"</Typography>
          </Box>
        </Modal>
      </>
    );
  },
};

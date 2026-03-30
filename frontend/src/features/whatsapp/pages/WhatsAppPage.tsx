import SendIcon from '@mui/icons-material/Send';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useSendWhatsAppMessage } from '@/features/whatsapp/hooks/useSendWhatsAppMessage';
import { useWhatsAppGroups } from '@/features/whatsapp/hooks/useWhatsAppGroups';
import { useWhatsAppStatus } from '@/features/whatsapp/hooks/useWhatsAppStatus';
import { PageLayout } from '@/shared/layouts/PageLayout';
import type { WhatsAppConnectionStatus } from '@/shared/api/client';

const statusConfig: Record<WhatsAppConnectionStatus, { label: string; color: 'success' | 'warning' | 'error' }> = {
  connected: { label: 'Conectado', color: 'success' },
  qr_pending: { label: 'Esperando QR', color: 'warning' },
  disconnected: { label: 'Desconectado', color: 'error' },
};

export default function WhatsAppPage() {
  const { data: statusData, isLoading: statusLoading } = useWhatsAppStatus();
  const connectionStatus = statusData?.status ?? 'disconnected';
  const isConnected = connectionStatus === 'connected';

  const { data: groups, isLoading: groupsLoading } = useWhatsAppGroups(isConnected);
  const sendMessage = useSendWhatsAppMessage();

  const [selectedGroup, setSelectedGroup] = useState('');
  const [content, setContent] = useState('');

  const config = statusConfig[connectionStatus];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedGroup || !content.trim()) return;

    sendMessage.mutate(
      { to: selectedGroup, content: content.trim() },
      {
        onSuccess: () => {
          setContent('');
        },
      },
    );
  }

  return (
    <PageLayout
      header={
        <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
          <Stack direction="row" alignItems="center" gap={1}>
            <WhatsAppIcon color="success" />
            <Typography variant="h6" fontWeight={600}>
              WhatsApp
            </Typography>
          </Stack>
          {statusLoading ? (
            <CircularProgress size={20} />
          ) : (
            <Chip label={config.label} color={config.color} size="small" variant="outlined" />
          )}
        </Stack>
      }
    >
      <Stack spacing={3} sx={{ maxWidth: 600 }}>
        {connectionStatus === 'qr_pending' && (
          <Alert severity="warning">
            Escanea el código QR en la terminal del servidor para conectar WhatsApp.
          </Alert>
        )}

        {connectionStatus === 'disconnected' && !statusLoading && (
          <Alert severity="error">WhatsApp no está conectado. Reinicia el servidor para inicializar el cliente.</Alert>
        )}

        {isConnected && (
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Enviar mensaje a un grupo
              </Typography>

              <FormControl fullWidth size="small" disabled={groupsLoading || sendMessage.isPending}>
                <InputLabel>Grupo</InputLabel>
                <Select
                  value={selectedGroup}
                  label="Grupo"
                  onChange={(e) => setSelectedGroup(e.target.value)}
                >
                  {groupsLoading ? (
                    <MenuItem disabled>Cargando grupos...</MenuItem>
                  ) : (
                    groups?.map((group) => (
                      <MenuItem key={group.id} value={group.id}>
                        {group.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                size="small"
                multiline
                rows={4}
                label="Mensaje"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={sendMessage.isPending}
              />

              <Button
                type="submit"
                variant="contained"
                startIcon={sendMessage.isPending ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
                disabled={!selectedGroup || !content.trim() || sendMessage.isPending}
                sx={{ alignSelf: 'flex-end' }}
              >
                {sendMessage.isPending ? 'Enviando...' : 'Enviar'}
              </Button>
            </Stack>
          </Box>
        )}
      </Stack>
    </PageLayout>
  );
}

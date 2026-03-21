import VisibilityIcon from '@mui/icons-material/Visibility';
import ShareIcon from '@mui/icons-material/Share';
import { IconButton, Paper, Popper, Stack, Typography, Button } from '@mui/material';
import { useState } from 'react';

interface BudgetActionButtonsProps {
  budgetIndex: number;
  onPreview: (index: number) => void;
  onShareEmail?: () => void;
  onShareLink?: () => void;
  onShareDiscord?: () => void;
  isLoadingEmail?: boolean;
  contactEmail?: string;
  hasDiscordChannel?: boolean;
}

export function BudgetActionButtons({
  budgetIndex,
  onPreview,
  onShareEmail,
  onShareLink,
  onShareDiscord,
  isLoadingEmail = false,
  contactEmail,
  hasDiscordChannel = false,
}: BudgetActionButtonsProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const hasEmail = !!contactEmail;

  return (
    <>
      <IconButton size="medium" onClick={() => onPreview(budgetIndex)} title="Vista previa" color="primary">
        <VisibilityIcon />
      </IconButton>
      <IconButton
        size="medium"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        title="Compartir"
        color="primary"
      >
        <ShareIcon />
      </IconButton>
      <Popper open={open} anchorEl={anchorEl} placement="bottom-end" sx={{ zIndex: 1400 }}>
        <Paper sx={{ p: 1, mt: 1, boxShadow: 3 }}>
          <Stack spacing={0.5}>
            <Typography variant="caption" sx={{ px: 1, display: 'block', color: 'text.secondary' }}>
              Compartir como:
            </Typography>
            <Button
              size="small"
              fullWidth
              disabled={isLoadingEmail || !hasEmail}
              sx={{ justifyContent: 'flex-start' }}
              onClick={() => {
                onShareEmail?.();
                setAnchorEl(null);
              }}
            >
              📧 Email
            </Button>
            <Button
              size="small"
              fullWidth
              disabled={!hasDiscordChannel}
              sx={{ justifyContent: 'flex-start' }}
              onClick={() => {
                onShareDiscord?.();
                setAnchorEl(null);
              }}
              title={hasDiscordChannel ? 'Enviar a Discord' : 'Sin canal de Discord vinculado'}
            >
              💬 Discord
            </Button>
            <Button
              size="small"
              fullWidth
              sx={{ justifyContent: 'flex-start' }}
              onClick={() => {
                onShareLink?.();
                setAnchorEl(null);
              }}
            >
              🔗 Copiar enlace
            </Button>
          </Stack>
        </Paper>
      </Popper>
    </>
  );
}

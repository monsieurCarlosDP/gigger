import VisibilityIcon from '@mui/icons-material/Visibility';
import ShareIcon from '@mui/icons-material/Share';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { IconButton, Paper, Popper, Stack, Typography, Button, ClickAwayListener, MenuItem } from '@mui/material';
import { useState, useRef } from 'react';

interface Contact {
  documentId?: string;
  Name?: string;
  Email?: string;
}

interface BudgetActionButtonsProps {
  budgetIndex: number;
  onPreview: (index: number) => void;
  onShareEmail?: (contactEmail: string) => void;
  onShareLink?: () => void;
  onShareDiscord?: () => void;
  isLoadingEmail?: boolean;
  contactEmail?: string; // Deprecated, use contacts instead
  contacts?: Contact[];
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
  contacts = [],
  hasDiscordChannel = false,
}: BudgetActionButtonsProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [emailAnchorEl, setEmailAnchorEl] = useState<HTMLElement | null>(null);
  const emailButtonRef = useRef<HTMLDivElement>(null);

  const open = Boolean(anchorEl);
  const emailOpen = Boolean(emailAnchorEl);

  // Use contacts array if available, fallback to contactEmail for backwards compatibility
  const contactList = contacts.length > 0 ? contacts : (contactEmail ? [{ Email: contactEmail }] : []);
  const hasEmail = contactList.length > 0 && contactList.some((c) => c.Email);
  const hasMultipleContacts = contactList.filter((c) => c.Email).length > 1;

  const handleEmailClick = (email: string) => {
    onShareEmail?.(email);
    setAnchorEl(null);
    setEmailAnchorEl(null);
  };

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
        <ClickAwayListener onClickAway={() => {
          setAnchorEl(null);
          setEmailAnchorEl(null);
        }}>
          <Paper sx={{ p: 1, mt: 1, boxShadow: 3 }}>
            <Stack spacing={0.5}>
              <Typography variant="caption" sx={{ px: 1, display: 'block', color: 'text.secondary' }}>
                Compartir como:
              </Typography>

              {/* Email button with submenu for multiple contacts */}
              <div ref={emailButtonRef}>
                <Button
                  size="small"
                  fullWidth
                  disabled={isLoadingEmail || !hasEmail}
                  sx={{
                    justifyContent: 'space-between',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    if (hasMultipleContacts) setEmailAnchorEl(e.currentTarget);
                  }}
                  onMouseLeave={() => {
                    // Don't close if hovering over the submenu
                    if (!emailOpen) setEmailAnchorEl(null);
                  }}
                  onClick={() => {
                    if (!hasMultipleContacts && hasEmail) {
                      handleEmailClick(contactList.find((c) => c.Email)?.Email || '');
                    } else if (!hasMultipleContacts) {
                      setAnchorEl(null);
                    }
                  }}
                >
                  <span>📧 Email</span>
                  {hasMultipleContacts && <ChevronRightIcon sx={{ fontSize: 18 }} />}
                </Button>

                {/* Submenu for multiple contacts */}
                {hasMultipleContacts && (
                  <Popper
                    open={emailOpen}
                    anchorEl={emailAnchorEl}
                    placement="right-start"
                    onMouseLeave={() => setEmailAnchorEl(null)}
                    sx={{ zIndex: 1401 }}
                  >
                    <Paper sx={{ p: 0, boxShadow: 4, minWidth: 200 }}>
                      <Stack spacing={0.5} sx={{ py: 0.5 }}>
                        {contactList
                          .filter((c) => c.Email)
                          .map((contact) => (
                            <MenuItem
                              key={contact.documentId || contact.Email}
                              onClick={() => handleEmailClick(contact.Email || '')}
                              disabled={isLoadingEmail}
                              sx={{
                                px: 2,
                                py: 1,
                                fontSize: '0.875rem',
                                whiteSpace: 'normal',
                              }}
                            >
                              <Stack spacing={0.25}>
                                <Typography variant="body2" fontWeight={500}>
                                  {contact.Name || 'Sin nombre'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {contact.Email}
                                </Typography>
                              </Stack>
                            </MenuItem>
                          ))}
                      </Stack>
                    </Paper>
                  </Popper>
                )}
              </div>

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
        </ClickAwayListener>
      </Popper>
    </>
  );
}

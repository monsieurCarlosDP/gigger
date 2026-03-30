import { useState } from 'react'
import { Box, Chip, CircularProgress, Divider, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'
import { useParams } from 'react-router'
import { useEvent } from '../hooks/useEvent'

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  Requested:  { label: 'Solicitud recibida', color: '#C847FF' },
  Budgeted:   { label: 'Presupuesto enviado', color: '#00D4FF' },
  Accepted:   { label: 'Confirmado',          color: '#4caf50' },
  Cancelled:  { label: 'Cancelado',           color: '#ef5350' },
}

const ROLE_EMOJI: Record<string, string> = {
  Novia: '👰',
  Novio: '🤵',
}

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <Box>
      <Typography sx={{ fontSize: '11px', letterSpacing: '.15em', textTransform: 'uppercase', color: 'rgba(245,242,237,.35)', mb: 0.5 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: '14px', color: 'rgba(245,242,237,.85)', lineHeight: 1.6 }}>
        {value}
      </Typography>
    </Box>
  )
}

export default function FollowUpPage() {
  const { id } = useParams<{ id: string }>()
  const { data: event, isLoading, isError } = useEvent(id ?? '')
  const [copied, setCopied] = useState(false)

  const followUpUrl = `${window.location.origin}/follow-up/${id}`
  const handleCopy = () => {
    navigator.clipboard.writeText(followUpUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#C847FF' }} />
      </Box>
    )
  }

  if (isError || !event) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h2" sx={{ color: '#F5F2ED', mb: 1 }}>Ups</Typography>
        <Typography sx={{ color: 'rgba(245,242,237,.45)' }}>No hemos encontrado el evento.</Typography>
      </Box>
    )
  }

  const status = event.EventStatus ? STATUS_LABEL[event.EventStatus] : null

  return (
    <Box sx={{ py: { xs: 4, sm: 6 } }}>
      {/* Header */}
      <Stack spacing={1} sx={{ mb: 4 }}>
        <Typography
          sx={{ fontSize: '11px', fontWeight: 500, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(245,242,237,.4)' }}
        >
          Tu solicitud
        </Typography>

        {/* URL de seguimiento */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            px: 2,
            py: 1.25,
            borderRadius: '12px',
            border: '1px solid rgba(200,71,255,.2)',
            background: 'rgba(200,71,255,.06)',
            maxWidth: '100%',
            overflow: 'hidden',
          }}
        >
          <Typography
            sx={{
              fontSize: '12px',
              color: 'rgba(245,242,237,.5)',
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontFamily: 'monospace',
            }}
          >
            {followUpUrl}
          </Typography>
          <Tooltip title={copied ? '¡Copiado!' : 'Copiar enlace'} placement="top">
            <IconButton size="small" onClick={handleCopy} sx={{ color: copied ? '#4caf50' : '#C847FF', flexShrink: 0 }}>
              {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Stack>
        <Typography variant="h2" sx={{ color: '#F5F2ED', lineHeight: 1.1 }}>
          {event.Name}
        </Typography>
        {status && (
          <Box sx={{ mt: 1 }}>
            <Chip
              label={status.label}
              size="small"
              sx={{
                background: `${status.color}18`,
                border: `1px solid ${status.color}44`,
                color: status.color,
                fontFamily: "'Epilogue', sans-serif",
                fontSize: '12px',
                letterSpacing: '.04em',
              }}
            />
          </Box>
        )}
      </Stack>

      <Stack spacing={2}>
        {/* Detalles del evento */}
        <Box sx={{ borderRadius: '20px', border: '1px solid rgba(200,71,255,.12)', background: 'rgba(255,255,255,.02)', p: { xs: 2.5, sm: 3 } }}>
          <Typography sx={{ fontSize: '10px', fontWeight: 500, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(245,242,237,.3)', mb: 2.5 }}>
            El evento
          </Typography>
          <Stack spacing={2}>
            <Field label="Fecha" value={event.StartDate} />
            <Field label="Lugar" value={event.Location} />
            <Field label="Descripción" value={event.Description} />
          </Stack>
        </Box>

        {/* La pareja */}
        {(() => {
          const couple = event.contacts?.filter((c) =>
            c.tags?.some((t) => t.Name === 'Novio' || t.Name === 'Novia')
          ) ?? []
          const others = event.contacts?.filter((c) =>
            !c.tags?.some((t) => t.Name === 'Novio' || t.Name === 'Novia')
          ) ?? []

          return (
            <>
              {couple.length > 0 && (
                <Box sx={{ borderRadius: '20px', border: '1px solid rgba(200,71,255,.12)', background: 'rgba(255,255,255,.02)', p: { xs: 2.5, sm: 3 } }}>
                  <Typography sx={{ fontSize: '10px', fontWeight: 500, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(245,242,237,.3)', mb: 2.5 }}>
                    La pareja
                  </Typography>
                  <Stack divider={<Divider sx={{ borderColor: 'rgba(255,255,255,.06)' }} />} spacing={2}>
                    {couple.map((contact) => {
                      const role = contact.tags?.find((t) => t.Name === 'Novio' || t.Name === 'Novia')
                      return (
                        <Stack key={contact.documentId} spacing={0.5}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            {role && (
                              <Typography sx={{ fontSize: '16px', lineHeight: 1 }}>
                                {ROLE_EMOJI[role.Name] ?? ''}
                              </Typography>
                            )}
                            <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#F5F2ED' }}>
                              {contact.Name}
                            </Typography>
                          </Stack>
                          {contact.Email && (
                            <Typography sx={{ fontSize: '13px', color: 'rgba(245,242,237,.5)' }}>
                              {contact.Email}
                            </Typography>
                          )}
                          {contact.Number && (
                            <Typography sx={{ fontSize: '13px', color: 'rgba(245,242,237,.5)' }}>
                              {contact.Number}
                            </Typography>
                          )}
                        </Stack>
                      )
                    })}
                  </Stack>
                </Box>
              )}

              {others.length > 0 && (
                <Box sx={{ borderRadius: '20px', border: '1px solid rgba(255,255,255,.08)', background: 'rgba(255,255,255,.02)', p: { xs: 2.5, sm: 3 } }}>
                  <Typography sx={{ fontSize: '10px', fontWeight: 500, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(245,242,237,.3)', mb: 2.5 }}>
                    Contactos de interés
                  </Typography>
                  <Stack divider={<Divider sx={{ borderColor: 'rgba(255,255,255,.06)' }} />} spacing={2}>
                    {others.map((contact) => (
                      <Stack key={contact.documentId} spacing={0.5}>
                        <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#F5F2ED' }}>
                          {contact.Name}
                        </Typography>
                        {contact.Email && (
                          <Typography sx={{ fontSize: '13px', color: 'rgba(245,242,237,.5)' }}>
                            {contact.Email}
                          </Typography>
                        )}
                        {contact.Number && (
                          <Typography sx={{ fontSize: '13px', color: 'rgba(245,242,237,.5)' }}>
                            {contact.Number}
                          </Typography>
                        )}
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              )}
            </>
          )
        })()}
      </Stack>
    </Box>
  )
}

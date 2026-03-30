import { Box, Button, CircularProgress, Divider, Stack, Typography } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import SendIcon from '@mui/icons-material/Send'
import type { StepProps, StepKey } from '../types/steps'

const EMPTY = '—'

interface SectionProps {
  title: string
  step: StepKey
  onGoToStep: (step: StepKey) => void
  children: React.ReactNode
}

function Section({ title, step, onGoToStep, children }: SectionProps) {
  return (
    <Box
      sx={{
        borderRadius: '16px',
        border: '1px solid rgba(200,71,255,.12)',
        background: 'rgba(255,255,255,.02)',
        p: { xs: 2, sm: 2.5 },
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography
          sx={{
            fontSize: '10px',
            fontWeight: 500,
            letterSpacing: '.2em',
            textTransform: 'uppercase',
            color: 'rgba(245,242,237,.35)',
          }}
        >
          {title}
        </Typography>
        <Button
          size="small"
          startIcon={<EditIcon sx={{ fontSize: '13px !important' }} />}
          onClick={() => onGoToStep(step)}
          sx={{
            fontSize: '11px',
            color: 'rgba(200,71,255,.7)',
            py: 0.25,
            px: 1,
            minWidth: 0,
            '&:hover': { color: '#C847FF', background: 'rgba(200,71,255,.08)' },
          }}
        >
          Editar
        </Button>
      </Stack>
      <Divider sx={{ borderColor: 'rgba(255,255,255,.06)', mb: 2 }} />
      <Stack spacing={1.5}>{children}</Stack>
    </Box>
  )
}

interface FieldRowProps {
  label: string
  value?: string
  empty?: boolean
}

function FieldRow({ label, value, empty }: FieldRowProps) {
  return (
    <Stack direction="row" spacing={2} alignItems="baseline">
      <Typography
        sx={{ fontSize: '12px', color: 'rgba(245,242,237,.35)', minWidth: 110, flexShrink: 0 }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: '13px',
          color: empty ? 'rgba(245,242,237,.2)' : 'rgba(245,242,237,.85)',
          fontStyle: empty ? 'italic' : 'normal',
          wordBreak: 'break-word',
        }}
      >
        {value || EMPTY}
      </Typography>
    </Stack>
  )
}

export function StepSummary({ data, onGoToStep, onSubmit, isSubmitting }: StepProps) {
  const roleLabel = (role: string) =>
    role === 'Novia' ? '👰 Novia' : role === 'Novio' ? '🤵 Novio' : undefined

  return (
    <Box sx={{ py: { xs: 2, sm: 4 } }}>
      <Typography
        sx={{
          fontSize: '11px',
          fontWeight: 500,
          letterSpacing: '.2em',
          textTransform: 'uppercase',
          color: 'rgba(245,242,237,.45)',
          mb: 2,
        }}
      >
        Casi listo
      </Typography>

      <Typography variant="h2" sx={{ color: '#F5F2ED', mb: 1 }}>
        Revisad antes de enviar.
      </Typography>
      <Typography variant="body1" sx={{ color: 'rgba(245,242,237,.55)', mb: 4, lineHeight: 1.65 }}>
        Si algo no está bien, podéis volver a cualquier sección con el botón de editar.
      </Typography>

      <Stack spacing={2}>
        {/* La pareja */}
        <Section title="La pareja" step="couple" onGoToStep={onGoToStep}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1.5, sm: 3 }}>
            <Stack spacing={1} flex={1}>
              <FieldRow label="Rol" value={roleLabel(data.person1Role)} empty={!data.person1Role} />
              <FieldRow label="Nombre" value={data.person1Name} empty={!data.person1Name} />
              <FieldRow label="Email" value={data.person1Email} empty={!data.person1Email} />
              <FieldRow label="Teléfono" value={data.person1Phone} empty={!data.person1Phone} />
            </Stack>
            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,.06)', display: { xs: 'none', sm: 'block' } }} />
            <Divider sx={{ borderColor: 'rgba(255,255,255,.06)', display: { xs: 'block', sm: 'none' } }} />
            <Stack spacing={1} flex={1}>
              <FieldRow label="Rol" value={roleLabel(data.person2Role)} empty={!data.person2Role} />
              <FieldRow label="Nombre" value={data.person2Name} empty={!data.person2Name} />
              <FieldRow label="Email" value={data.person2Email} empty={!data.person2Email} />
              <FieldRow label="Teléfono" value={data.person2Phone} empty={!data.person2Phone} />
            </Stack>
          </Stack>
        </Section>

        {/* Fecha y lugar */}
        <Section title="Fecha y lugar" step="event-date" onGoToStep={onGoToStep}>
          <FieldRow label="Fecha" value={data.StartDate} empty={!data.StartDate} />
          <FieldRow label="Lugar" value={data.Location} empty={!data.Location} />
          {data.venueContactName && (
            <>
              <Divider sx={{ borderColor: 'rgba(255,255,255,.06)' }} />
              <Typography sx={{ fontSize: '11px', color: 'rgba(245,242,237,.3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
                Contacto del lugar
              </Typography>
              <FieldRow label="Nombre" value={data.venueContactName} />
              <FieldRow label="Teléfono" value={data.venueContactPhone} empty={!data.venueContactPhone} />
              <FieldRow label="Email" value={data.venueContactEmail} empty={!data.venueContactEmail} />
            </>
          )}
        </Section>

        {/* Descripción */}
        <Section title="Descripción" step="description" onGoToStep={onGoToStep}>
          {data.Description ? (
            <Typography
              sx={{
                fontSize: '13px',
                color: 'rgba(245,242,237,.75)',
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {data.Description}
            </Typography>
          ) : (
            <Typography sx={{ fontSize: '13px', color: 'rgba(245,242,237,.2)', fontStyle: 'italic' }}>
              Sin descripción
            </Typography>
          )}
        </Section>
      </Stack>

      <Button
        variant="contained"
        size="large"
        fullWidth
        onClick={onSubmit}
        disabled={isSubmitting}
        startIcon={isSubmitting ? <CircularProgress size={18} sx={{ color: 'inherit' }} /> : <SendIcon />}
        sx={{ mt: 3 }}
      >
        {isSubmitting ? 'Enviando...' : 'Enviar solicitud'}
      </Button>
    </Box>
  )
}

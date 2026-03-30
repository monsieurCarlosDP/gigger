import { useRef } from 'react'
import { Box, Stack, TextField, Typography } from '@mui/material'
import type { StepProps } from '../types/steps'

export function StepEventDate({ data, errors, onChange, isSubmitting }: StepProps) {
  const dateInputRef = useRef<HTMLInputElement>(null)

  const handleDateClick = () => {
    dateInputRef.current?.showPicker?.()
  }

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
        El gran día
      </Typography>

      <Typography variant="h2" sx={{ color: '#F5F2ED', mb: 1 }}>
        ¿Cuándo y dónde?
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: 'rgba(245,242,237,.55)', mb: 4, lineHeight: 1.65 }}
      >
        La fecha es lo primero que bloqueamos. Sin ella no podemos reservar el día,
        así que aseguraos de tenerla antes de continuar.
      </Typography>

      <Stack spacing={3}>
        <TextField
          fullWidth
          label="Fecha del evento"
          type="date"
          value={data.StartDate}
          onChange={(e) => onChange('StartDate', e.target.value)}
          onClick={handleDateClick}
          onFocus={handleDateClick}
          error={!!errors.StartDate}
          helperText={errors.StartDate}
          disabled={isSubmitting}
          slotProps={{
            inputLabel: { shrink: true },
            input: { inputRef: dateInputRef },
          }}
        />

        <Box>
          <TextField
            fullWidth
            label="Lugar del evento"
            value={data.Location}
            onChange={(e) => onChange('Location', e.target.value)}
            error={!!errors.Location}
            helperText={errors.Location}
            disabled={isSubmitting}
            placeholder="Finca El Olivar, Ctra. Nacional 340 km 12, Tarragona"
          />
          <Typography
            sx={{
              fontSize: '12px',
              color: 'rgba(245,242,237,.35)',
              mt: 0.75,
              ml: 0.5,
              lineHeight: 1.5,
            }}
          >
            Incluye el nombre del espacio, la dirección completa y la población más cercana.
          </Typography>
        </Box>

        {/* Contacto del lugar */}
        <Box>
          <Typography
            sx={{
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '.2em',
              textTransform: 'uppercase',
              color: 'rgba(245,242,237,.35)',
              mb: 2,
            }}
          >
            Persona de contacto del lugar{' '}
            <Box component="span" sx={{ textTransform: 'none', letterSpacing: 0, opacity: 0.6 }}>
              (opcional)
            </Box>
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: 'rgba(245,242,237,.4)', mb: 2.5, lineHeight: 1.6 }}
          >
            Si el espacio tiene un coordinador o responsable, déjanos sus datos para poder coordinar la logística del día.
          </Typography>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Nombre"
              value={data.venueContactName}
              onChange={(e) => onChange('venueContactName', e.target.value)}
              disabled={isSubmitting}
              placeholder="Ana García"
            />
            <TextField
              fullWidth
              label="Teléfono"
              value={data.venueContactPhone}
              onChange={(e) => onChange('venueContactPhone', e.target.value)}
              disabled={isSubmitting}
              placeholder="+34 666 123 456"
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={data.venueContactEmail}
              onChange={(e) => onChange('venueContactEmail', e.target.value)}
              error={!!errors.venueContactEmail}
              helperText={errors.venueContactEmail}
              disabled={isSubmitting}
              placeholder="coordinacion@finca.com"
            />
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}

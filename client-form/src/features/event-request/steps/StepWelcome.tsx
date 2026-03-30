import { Box, Typography } from '@mui/material'
import type { StepProps } from '../types/steps'

export function StepWelcome(_props: StepProps) {
  return (
    <Box sx={{ py: { xs: 2, sm: 4 } }}>
      {/* Eyebrow */}
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
        Solicitud de evento
      </Typography>

      {/* Headline */}
      <Typography
        variant="h1"
        sx={{
          background: 'linear-gradient(135deg, #F5F2ED 0%, rgba(245,242,237,.6) 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 1,
          lineHeight: 1.02,
        }}
      >
        Bienvenid@s
      </Typography>
      <Typography
        variant="h1"
        sx={{
          background: 'linear-gradient(135deg, #C847FF 0%, #00D4FF 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 4,
          lineHeight: 1.02,
        }}
      >
        a vuestro festival.
      </Typography>

      {/* Body */}
      <Typography
        variant="body1"
        sx={{
          color: 'rgba(245,242,237,.65)',
          lineHeight: 1.75,
          fontSize: '1.05rem',
        }}
      >
        Estáis a punto de dar el primer paso para que vuestra boda tenga la música que se merece.
        <br /><br />
        En unos minutos y con unas pocas preguntas tendremos todo lo que necesitamos para preparar
        una propuesta a medida. Sin formularios kilométricos, sin letra pequeña — solo vosotros,
        vuestra fecha y las ganas de bailar.
      </Typography>

      <Box
        sx={{
          mt: 5,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Box
          sx={{
            height: '1px',
            flex: 1,
            background: 'linear-gradient(90deg, rgba(200,71,255,.6) 0%, rgba(0,212,255,.3) 100%)',
          }}
        />
        <Typography
          sx={{
            fontSize: '11px',
            letterSpacing: '.18em',
            textTransform: 'uppercase',
            color: 'rgba(245,242,237,.3)',
          }}
        >
          Pulsa → para empezar
        </Typography>
      </Box>
    </Box>
  )
}

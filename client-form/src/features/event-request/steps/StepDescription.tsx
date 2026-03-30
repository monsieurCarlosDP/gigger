import { Box, TextField, Typography } from '@mui/material'
import type { StepProps } from '../types/steps'

export function StepDescription({ data, errors, onChange, isSubmitting }: StepProps) {
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
        Cuéntanoslo
      </Typography>

      <Typography variant="h2" sx={{ color: '#F5F2ED', mb: 1 }}>
        ¿Cómo lo imaginais?
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: 'rgba(245,242,237,.55)', mb: 4, lineHeight: 1.65 }}
      >
        Contadnos todo lo que queráis: el ambiente que buscáis, si hay algún momento especial,
        el estilo musical, lo que os preocupa... Cuanto más nos contéis, mejor podremos
        preparar algo que sea realmente vuestro.
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={8}
        label="Descripción"
        value={data.Description}
        onChange={(e) => onChange('Description', e.target.value)}
        error={!!errors.Description}
        helperText={errors.Description}
        disabled={isSubmitting}
        placeholder="Soñamos con una boda íntima al aire libre, con música que vaya de la ceremonia a la pista sin que nadie se dé cuenta..."
      />
    </Box>
  )
}

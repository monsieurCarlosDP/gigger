import { Box, Stack, TextField, Typography } from '@mui/material'
import type { FormData, PersonRole } from '../types/formData'
import type { StepProps, FormErrors } from '../types/steps'

const ROLES: { value: PersonRole; label: string; emoji: string }[] = [
  { value: 'Novia', label: 'Novia', emoji: '👰' },
  { value: 'Novio', label: 'Novio', emoji: '🤵' },
]

interface PersonCardProps {
  index: 1 | 2
  nameKey: keyof FormData
  emailKey: keyof FormData
  phoneKey: keyof FormData
  roleKey: keyof FormData
  data: FormData
  errors: FormErrors
  onChange: StepProps['onChange']
  isSubmitting: boolean
}

function PersonCard({ index, nameKey, emailKey, phoneKey, roleKey, data, errors, onChange, isSubmitting }: PersonCardProps) {
  const role = data[roleKey] as PersonRole

  return (
    <Box
      sx={{
        borderRadius: '20px',
        border: '1px solid rgba(200,71,255,.18)',
        background: 'rgba(255,255,255,.03)',
        backdropFilter: 'blur(10px)',
        p: { xs: 2.5, sm: 3 },
        flex: 1,
      }}
    >
      {/* Eyebrow */}
      <Typography
        sx={{
          fontSize: '10px',
          fontWeight: 500,
          letterSpacing: '.2em',
          textTransform: 'uppercase',
          color: 'rgba(245,242,237,.35)',
          mb: 2,
        }}
      >
        Persona {index}
      </Typography>

      {/* Role toggle */}
      <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
        {ROLES.map((r) => {
          const selected = role === r.value
          return (
            <Box
              key={r.value}
              onClick={() => !isSubmitting && onChange(roleKey, r.value)}
              sx={{
                flex: 1,
                py: 1.25,
                px: 1.5,
                borderRadius: '12px',
                border: '1.5px solid',
                borderColor: selected ? 'rgba(200,71,255,.7)' : 'rgba(255,255,255,.1)',
                background: selected
                  ? 'linear-gradient(135deg, rgba(200,71,255,.18) 0%, rgba(0,212,255,.1) 100%)'
                  : 'rgba(255,255,255,.04)',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                textAlign: 'center',
                transition: 'all .25s cubic-bezier(.4,0,.2,1)',
                boxShadow: selected ? '0 0 16px rgba(200,71,255,.2)' : 'none',
                '&:hover': !isSubmitting ? {
                  borderColor: 'rgba(200,71,255,.4)',
                  background: 'rgba(200,71,255,.08)',
                } : {},
              }}
            >
              <Typography sx={{ fontSize: '18px', lineHeight: 1, mb: 0.5 }}>
                {r.emoji}
              </Typography>
              <Typography
                sx={{
                  fontSize: '13px',
                  fontWeight: selected ? 500 : 400,
                  color: selected ? '#E040FF' : 'rgba(245,242,237,.5)',
                  transition: 'color .2s',
                }}
              >
                {r.label}
              </Typography>
            </Box>
          )
        })}
      </Stack>

      {errors[roleKey] && (
        <Typography sx={{ fontSize: '12px', color: 'rgba(224,64,255,.8)', mb: 2, mt: -2 }}>
          {errors[roleKey]}
        </Typography>
      )}

      {/* Fields */}
      <Stack spacing={2}>
        <TextField
          fullWidth
          label="Nombre"
          name={String(nameKey)}
          value={data[nameKey] as string}
          onChange={(e) => onChange(nameKey, e.target.value)}
          error={!!errors[nameKey]}
          helperText={errors[nameKey]}
          disabled={isSubmitting}
          required
        />
        <TextField
          fullWidth
          label="Email"
          name={String(emailKey)}
          type="email"
          value={data[emailKey] as string}
          onChange={(e) => onChange(emailKey, e.target.value)}
          error={!!errors[emailKey]}
          helperText={errors[emailKey]}
          disabled={isSubmitting}
          required
        />
        <TextField
          fullWidth
          label="Teléfono"
          name={String(phoneKey)}
          value={data[phoneKey] as string}
          onChange={(e) => onChange(phoneKey, e.target.value)}
          error={!!errors[phoneKey]}
          helperText={errors[phoneKey]}
          disabled={isSubmitting}
        />
      </Stack>
    </Box>
  )
}

export function StepCouple({ data, errors, onChange, isSubmitting }: StepProps) {
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
        Los protagonistas
      </Typography>

      <Typography variant="h2" sx={{ color: '#F5F2ED', mb: 1 }}>
        ¿Quiénes sois?
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: 'rgba(245,242,237,.55)', mb: 4, lineHeight: 1.65 }}
      >
        Poneos cada uno en vuestra tarjeta. Así sabremos cómo llamaros.
      </Typography>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems="stretch"
      >
        <PersonCard
          index={1}
          nameKey="person1Name"
          emailKey="person1Email"
          phoneKey="person1Phone"
          roleKey="person1Role"
          data={data}
          errors={errors}
          onChange={onChange}
          isSubmitting={isSubmitting}
        />
        <PersonCard
          index={2}
          nameKey="person2Name"
          emailKey="person2Email"
          phoneKey="person2Phone"
          roleKey="person2Role"
          data={data}
          errors={errors}
          onChange={onChange}
          isSubmitting={isSubmitting}
        />
      </Stack>
    </Box>
  )
}

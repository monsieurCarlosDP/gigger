import { useReducer, useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Box, IconButton, Typography, Alert } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { formReducer, initialState } from '../hooks/formReducer'
import { useEventRequestForm } from '../hooks/useEventRequestForm'
import type { StepKey, StepConfig, FormErrors } from '../types/steps'
import type { FormData as WeddingFormData } from '../types/formData'
import { StepWelcome } from '../steps/StepWelcome'
import { StepCouple } from '../steps/StepCouple'
import { StepEventDate } from '../steps/StepEventDate'
import { StepDescription } from '../steps/StepDescription'
import { StepSummary } from '../steps/StepSummary'

// ─────────────────────────────────────────────
// Configuración de steps
// ─────────────────────────────────────────────

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const STEP_ORDER: StepKey[] = ['welcome', 'couple', 'event-date', 'description', 'summary']

export const STEPS: Record<StepKey, StepConfig> = {
  welcome: {
    label: 'Bienvenida',
    component: StepWelcome,
  },
  couple: {
    label: 'La pareja',
    component: StepCouple,
    validate: (data: WeddingFormData): FormErrors => {
      const errors: FormErrors = {}

      if (!data.person1Role) errors.person1Role = 'Selecciona un rol'
      if (!data.person1Name.trim()) errors.person1Name = 'El nombre es requerido'
      if (!data.person1Email.trim()) errors.person1Email = 'El email es requerido'
      else if (!emailRegex.test(data.person1Email)) errors.person1Email = 'Email inválido'

      if (!data.person2Role) errors.person2Role = 'Selecciona un rol'
      if (!data.person2Name.trim()) errors.person2Name = 'El nombre es requerido'
      if (!data.person2Email.trim()) errors.person2Email = 'El email es requerido'
      else if (!emailRegex.test(data.person2Email)) errors.person2Email = 'Email inválido'

      return errors
    },
  },
  description: {
    label: 'Descripción',
    component: StepDescription,
  },
  summary: {
    label: 'Resumen',
    component: StepSummary,
  },
  'event-date': {
    label: 'Fecha y lugar',
    component: StepEventDate,
    validate: (data: WeddingFormData): FormErrors => {
      const errors: FormErrors = {}

      if (!data.StartDate) errors.StartDate = 'La fecha es necesaria para reservar el día'

      if (data.venueContactName?.trim()) {
        if (!data.venueContactEmail?.trim() && !data.venueContactPhone?.trim()) {
          errors.venueContactEmail = 'Añade al menos un email o teléfono de contacto'
        } else if (data.venueContactEmail?.trim() && !emailRegex.test(data.venueContactEmail)) {
          errors.venueContactEmail = 'Email inválido'
        }
      }

      return errors
    },
  },
}

// ─────────────────────────────────────────────
// Navegación inferior (estilo slideshow)
// ─────────────────────────────────────────────

interface StepNavProps {
  index: number
  total: number
  isFirst: boolean
  isLast: boolean
  isSubmitting: boolean
  onPrev: () => void
  onNext: () => void
}

function StepNav({ index, total, isFirst, isLast, isSubmitting, onPrev, onNext }: StepNavProps) {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: 'rgba(20,20,20,.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,.1)',
        borderRadius: '60px',
        px: '18px',
        py: '8px',
      }}
    >
      <IconButton
        size="small"
        onClick={onPrev}
        disabled={isFirst || isSubmitting}
        sx={{
          color: 'white',
          width: 34,
          height: 34,
          '&:hover': { background: 'rgba(255,255,255,.1)' },
          '&:disabled': { opacity: 0.3 },
        }}
      >
        <ArrowBackIcon fontSize="small" />
      </IconButton>

      <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
        {Array.from({ length: total }).map((_, i) => (
          <Box
            key={i}
            sx={{
              height: '5px',
              borderRadius: '3px',
              background: i === index ? 'white' : 'rgba(255,255,255,.25)',
              width: i === index ? '18px' : '5px',
              transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
            }}
          />
        ))}
      </Box>

      <Typography
        sx={{
          color: 'rgba(255,255,255,.4)',
          fontSize: '12px',
          minWidth: '44px',
          textAlign: 'center',
          letterSpacing: '.06em',
        }}
      >
        {index + 1} / {total}
      </Typography>

      <IconButton
        size="small"
        onClick={onNext}
        disabled={isSubmitting}
        sx={{
          color: isLast ? '#C847FF' : 'white',
          width: 34,
          height: 34,
          '&:hover': { background: 'rgba(255,255,255,.1)' },
          '&:disabled': { opacity: 0.3 },
        }}
      >
        <ArrowForwardIcon fontSize="small" />
      </IconButton>
    </Box>
  )
}

// ─────────────────────────────────────────────
// Slide animation wrapper
// ─────────────────────────────────────────────

function Slide({ children, direction }: { children: React.ReactNode; direction: 'right' | 'left' }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <Box
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : direction === 'right' ? 'translateX(60px) scale(0.97)' : 'translateX(-60px) scale(0.97)',
        transition: 'opacity .5s cubic-bezier(.4,0,.2,1), transform .5s cubic-bezier(.4,0,.2,1)',
      }}
    >
      {children}
    </Box>
  )
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────

export default function EventRequestFormPage() {
  const [state, dispatch] = useReducer(formReducer, initialState)
  const { mutate, isPending } = useEventRequestForm()
  const navigate = useNavigate()
  const slideDirection = useRef<'right' | 'left'>('right')

  const currentIndex = STEP_ORDER.indexOf(state.step)
  const isFirst = currentIndex === 0
  const isLast = currentIndex === STEP_ORDER.length - 1
  const currentConfig = STEPS[state.step]

  const handleChange = (name: keyof typeof state.data, value: unknown) => {
    dispatch({ type: 'CHANGE_FIELD', payload: { name, value } })
  }

  const handleSubmit = () => {
    dispatch({ type: 'SUBMIT_START' })
    mutate(state.data, {
      onSuccess: (res) => {
        const docId = res.data.documentId
        localStorage.setItem('gigger_event_id', docId)
        dispatch({ type: 'SUBMIT_SUCCESS' })
        navigate(`/follow-up/${docId}`)
      },
      onError: (err) =>
        dispatch({ type: 'SUBMIT_ERROR', payload: err instanceof Error ? err.message : 'Error desconocido' }),
    })
  }

  const handleNext = () => {
    const errors = currentConfig.validate?.(state.data) ?? {}
    if (Object.keys(errors).length > 0) {
      dispatch({ type: 'SET_ERRORS', payload: errors })
      return
    }

    if (isLast) return

    slideDirection.current = 'right'
    dispatch({ type: 'GO_TO_STEP', payload: STEP_ORDER[currentIndex + 1] })
  }

  const handlePrev = () => {
    slideDirection.current = 'left'
    dispatch({ type: 'GO_TO_STEP', payload: STEP_ORDER[currentIndex - 1] })
  }

  const handleGoToStep = (step: StepKey) => {
    const targetIndex = STEP_ORDER.indexOf(step)
    slideDirection.current = targetIndex < currentIndex ? 'left' : 'right'
    dispatch({ type: 'GO_TO_STEP', payload: step })
  }

  if (state.status === 'success') {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2 }}>
        <Box sx={{ textAlign: 'center', maxWidth: 520 }}>
          <Typography
            variant="h1"
            sx={{
              background: 'linear-gradient(135deg, #C847FF 0%, #00D4FF 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 3,
            }}
          >
            ¡Recibido!
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(245,242,237,.72)', lineHeight: 1.7 }}>
            Tu solicitud ha sido enviada correctamente.
            <br />
            Nos pondremos en contacto pronto.
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        pb: '96px',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 640 }}>
        {state.status === 'error' && state.errorMessage && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {state.errorMessage}
          </Alert>
        )}

        <Slide key={state.step} direction={slideDirection.current}>
          {currentConfig.component({
            data: state.data,
            errors: state.errors,
            onChange: handleChange,
            onGoToStep: handleGoToStep,
            onSubmit: handleSubmit,
            isSubmitting: isPending,
          })}
        </Slide>
      </Box>

      <StepNav
        index={currentIndex}
        total={STEP_ORDER.length}
        isFirst={isFirst}
        isLast={isLast}
        isSubmitting={isPending}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </Box>
  )
}

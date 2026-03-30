import { useReducer } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material'
import { useEventRequestForm } from '../hooks/useEventRequestForm'
import { formReducer, initialState, type FormData } from '../hooks/formReducer'
import { useFieldValidator } from '../hooks/useFieldValidator'
import { eventRequestFields } from '../config/eventRequestFields'

export default function EventRequestFormPage() {
  const [state, dispatch] = useReducer(formReducer, initialState)
  const { mutate } = useEventRequestForm()
  const { validateForm, getVisibleFields } = useFieldValidator()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | any) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement
    dispatch({
      type: 'CHANGE_FIELD',
      payload: {
        name: target.name as keyof FormData,
        value: target.value,
      },
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validar usando la configuración de campos
    const errors = validateForm(eventRequestFields, state.data)

    if (Object.keys(errors).length > 0) {
      dispatch({ type: 'SET_ERRORS', payload: errors })
      return
    }

    dispatch({ type: 'SUBMIT_START' })

    const submitData = {
      Name: state.data.Name,
      Type: state.data.Type,
      StartDate: state.data.StartDate,
      EndDate: state.data.EndDate || undefined,
      Location: state.data.Location || undefined,
      Distance: state.data.Distance ? Number(state.data.Distance) : undefined,
      GigType: state.data.GigType as any, // Ya fue validado
      ContactEmail: state.data.ContactEmail,
      ContactPhone: state.data.ContactPhone || undefined,
      Notes: state.data.Notes || undefined,
    }

    mutate(submitData, {
      onSuccess: () => {
        dispatch({ type: 'SUBMIT_SUCCESS' })
      },
      onError: (error) => {
        dispatch({
          type: 'SUBMIT_ERROR',
          payload: error instanceof Error ? error.message : 'Error desconocido',
        })
      },
    })
  }

  const handleReset = () => {
    dispatch({ type: 'RESET' })
  }

  const visibleFields = getVisibleFields(eventRequestFields, state.data)

  return (
    <Box sx={{ py: 6 }}>
      <Card>
        <CardContent>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h1"
              component="h1"
              sx={{
                background: 'linear-gradient(135deg, #C847FF 0%, #00D4FF 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              Solicitar Evento
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(245, 242, 237, 0.6)',
                fontSize: '1rem',
              }}
            >
              Cuéntanos sobre tu evento y nos pondremos en contacto pronto.
            </Typography>
          </Box>

          {state.status === 'success' && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
              ¡Tu solicitud ha sido enviada correctamente! Nos pondremos en contacto pronto.
            </Alert>
          )}

          {state.status === 'error' && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {state.errorMessage || 'Hubo un error al enviar tu solicitud. Intenta de nuevo.'}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={2.5}>
              {visibleFields.map((field) => {
                const fieldValue = state.data[field.name]
                const fieldError = state.errors[field.name]
                const isDisabled = state.status === 'submitting'

                // TextField (text, email, number, datetime)
                if (field.type !== 'select') {
                  const inputType =
                    field.type === 'datetime' ? 'datetime-local' : field.type === 'email' ? 'email' : field.type === 'number' ? 'number' : 'text'
                  const isMultiline = field.name === 'Notes'

                  return (
                    <TextField
                      key={field.name}
                      fullWidth
                      label={field.label}
                      name={field.name}
                      type={inputType}
                      value={fieldValue}
                      onChange={handleChange}
                      error={!!fieldError}
                      helperText={fieldError || field.help}
                      disabled={isDisabled}
                      required={field.required}
                      placeholder={field.placeholder}
                      multiline={isMultiline}
                      rows={isMultiline ? 4 : undefined}
                      slotProps={
                        field.type === 'datetime'
                          ? {
                              input: {
                                sx: { '&::-webkit-calendar-picker-indicator': { cursor: 'pointer' } },
                              },
                            }
                          : {}
                      }
                      inputProps={
                        field.type === 'number'
                          ? {
                              step: '0.1',
                              min: '0',
                            }
                          : {}
                      }
                    />
                  )
                }

                // Select (dropdown)
                if (field.type === 'select') {
                  return (
                    <FormControl
                      key={field.name}
                      fullWidth
                      error={!!fieldError}
                      disabled={isDisabled}
                    >
                      <InputLabel>{field.label}</InputLabel>
                      <Select
                        name={field.name}
                        value={fieldValue}
                        onChange={handleChange}
                        label={field.label}
                      >
                        {!field.required && <MenuItem value="">Seleccionar...</MenuItem>}
                        {field.options?.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {fieldError && <FormHelperText>{fieldError}</FormHelperText>}
                    </FormControl>
                  )
                }
              })}

              {/* Botones */}
              <Stack direction="row" spacing={2} sx={{ pt: 3 }}>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={state.status === 'submitting'}
                  fullWidth
                  startIcon={state.status === 'submitting' ? <CircularProgress size={20} sx={{ color: '#C847FF' }} /> : undefined}
                >
                  {state.status === 'submitting' ? 'Enviando...' : 'Solicitar Evento'}
                </Button>
                <Button
                  variant="outlined"
                  type="button"
                  onClick={handleReset}
                  disabled={state.status === 'submitting'}
                  sx={{ minWidth: 120 }}
                >
                  Limpiar
                </Button>
              </Stack>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

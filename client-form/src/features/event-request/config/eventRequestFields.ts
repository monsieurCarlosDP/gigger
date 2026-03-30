import type { FieldConfig } from '../types/fieldConfig'
import { validators } from '../validators'

export const eventRequestFields: FieldConfig[] = [
  {
    name: 'Name',
    label: 'Nombre del evento',
    type: 'text',
    required: true,
    placeholder: 'Ej: Boda de María y Juan',
    validators: [
      validators.required('El nombre del evento es requerido'),
      validators.minLength(3, 'El nombre debe tener al menos 3 caracteres'),
    ],
  },
  // Type es siempre "Solicitado" para el formulario público, no se muestra
  {
    name: 'GigType',
    label: 'Tipo de gig',
    type: 'select',
    required: true,
    options: [
      { value: 'Wedding', label: 'Boda' },
      { value: 'Party', label: 'Fiesta' },
      { value: 'Village', label: 'Pueblo' },
      { value: 'Gig', label: 'Gig' },
    ],
    validators: [validators.required('El tipo de gig es requerido')],
  },
  {
    name: 'StartDate',
    label: 'Fecha de inicio',
    type: 'datetime',
    required: true,
    validators: [validators.required('La fecha de inicio es requerida')],
  },
  {
    name: 'EndDate',
    label: 'Fecha de fin',
    type: 'datetime',
    required: false,
  },
  {
    name: 'Location',
    label: 'Ubicación',
    type: 'text',
    required: false,
    placeholder: 'Ej: Salón El Paraíso, Calle Principal 123',
  },
  {
    name: 'Distance',
    label: 'Distancia',
    type: 'number',
    required: false,
    help: 'En kilómetros',
    validators: [validators.min(0, 'La distancia no puede ser negativa')],
  },
  {
    name: 'ContactEmail',
    label: 'Email de contacto',
    type: 'email',
    required: true,
    placeholder: 'tu@email.com',
    validators: [
      validators.required('El email es requerido'),
      validators.email('Por favor introduce un email válido'),
    ],
  },
  {
    name: 'ContactPhone',
    label: 'Teléfono de contacto',
    type: 'text',
    required: false,
    placeholder: '+34 666 123 456',
  },
  {
    name: 'Notes',
    label: 'Notas adicionales',
    type: 'text',
    required: false,
    placeholder: 'Cuéntanos detalles adicionales sobre el evento...',
  },
]

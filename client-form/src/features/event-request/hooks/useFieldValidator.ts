import type { FormData } from './formReducer'
import type { FieldConfig } from '../types/fieldConfig'

export function useFieldValidator() {
  const validateField = (field: FieldConfig, value: unknown): string | null => {
    if (!field.validators || field.validators.length === 0) {
      return null
    }

    for (const validator of field.validators) {
      const error = validator(value)
      if (error) {
        return error
      }
    }

    return null
  }

  const validateForm = (fields: FieldConfig[], formData: FormData): Partial<FormData> => {
    const errors: Partial<FormData> = {}

    for (const field of fields) {
      // Skip validation si el campo es condicional y no aplica
      if (field.conditional && !field.conditional(formData)) {
        continue
      }

      const error = validateField(field, formData[field.name])
      if (error) {
        errors[field.name] = error as any
      }
    }

    return errors
  }

  const getVisibleFields = (fields: FieldConfig[], formData: FormData): FieldConfig[] => {
    return fields.filter((field) => {
      if (field.conditional) {
        return field.conditional(formData)
      }
      return true
    })
  }

  return {
    validateField,
    validateForm,
    getVisibleFields,
  }
}

import type { FormData } from '../hooks/formReducer'

export type FieldType = 'text' | 'email' | 'number' | 'datetime' | 'select'

export type ValidatorRule = (value: unknown) => string | null // null = válido

export interface SelectOption {
  value: string
  label: string
}

export interface FieldConfig {
  name: keyof FormData
  label: string
  type: FieldType
  required: boolean
  validators?: ValidatorRule[]
  conditional?: (data: FormData) => boolean
  options?: SelectOption[]
  help?: string
  placeholder?: string
}

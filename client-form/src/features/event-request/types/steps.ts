import type { ReactElement } from 'react'
import type { FormData } from './formData'

export type StepKey = 'welcome' | 'couple' | 'event-date' | 'description' | 'summary'

export type FormErrors = Partial<Record<keyof FormData, string>>

export interface StepProps {
  data: FormData
  errors: FormErrors
  onChange: (name: keyof FormData, value: unknown) => void
  onGoToStep: (step: StepKey) => void
  onSubmit: () => void
  isSubmitting: boolean
}

export interface StepConfig {
  label: string
  component: (props: StepProps) => ReactElement
  validate?: (data: FormData) => FormErrors
}

import type { StepKey, FormErrors } from '../types/steps'
import { initialFormData } from '../types/formData'
import type { FormData } from '../types/formData'

export interface FormState {
  data: FormData
  errors: FormErrors
  status: 'idle' | 'submitting' | 'success' | 'error'
  step: StepKey
  errorMessage?: string
}

export type FormAction =
  | { type: 'CHANGE_FIELD'; payload: { name: keyof FormData; value: unknown } }
  | { type: 'SET_ERRORS'; payload: FormErrors }
  | { type: 'CLEAR_ERROR'; payload: keyof FormData }
  | { type: 'GO_TO_STEP'; payload: StepKey }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_ERROR'; payload: string }
  | { type: 'RESET' }

export const initialState: FormState = {
  data: initialFormData,
  errors: {},
  status: 'idle',
  step: 'welcome',
}

export const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'CHANGE_FIELD':
      return {
        ...state,
        data: { ...state.data, [action.payload.name]: action.payload.value },
        errors: { ...state.errors, [action.payload.name]: undefined },
      }

    case 'SET_ERRORS':
      return { ...state, errors: action.payload }

    case 'CLEAR_ERROR':
      return { ...state, errors: { ...state.errors, [action.payload]: undefined } }

    case 'GO_TO_STEP':
      return { ...state, step: action.payload, errors: {} }

    case 'SUBMIT_START':
      return { ...state, status: 'submitting', errorMessage: undefined }

    case 'SUBMIT_SUCCESS':
      return { ...state, status: 'success', data: initialFormData, errors: {}, step: 'welcome' }

    case 'SUBMIT_ERROR':
      return { ...state, status: 'error', errorMessage: action.payload }

    case 'RESET':
      return initialState

    default:
      return state
  }
}

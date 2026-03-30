import type { EventType, GigType } from '@/shared/types/api'

export interface FormData {
  Name: string
  Type: EventType
  StartDate: string
  EndDate: string
  Location: string
  Distance: string
  GigType: GigType | ''
  ContactEmail: string
  ContactPhone: string
  Notes: string
}

export interface FormState {
  data: FormData
  errors: Partial<FormData>
  status: 'idle' | 'submitting' | 'success' | 'error'
  errorMessage?: string
}

export type FormAction =
  | { type: 'CHANGE_FIELD'; payload: { name: keyof FormData; value: unknown } }
  | { type: 'SET_ERRORS'; payload: Partial<FormData> }
  | { type: 'CLEAR_ERROR'; payload: keyof FormData }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_ERROR'; payload: string }
  | { type: 'RESET' }

export const initialFormData: FormData = {
  Name: '',
  Type: 'Requested',
  StartDate: '',
  EndDate: '',
  Location: '',
  Distance: '',
  GigType: '',
  ContactEmail: '',
  ContactPhone: '',
  Notes: '',
}

export const initialState: FormState = {
  data: initialFormData,
  errors: {},
  status: 'idle',
}

export const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'CHANGE_FIELD':
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.name]: action.payload.value,
        },
        errors: {
          ...state.errors,
          [action.payload.name]: undefined,
        },
      }

    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.payload,
        status: 'error',
      }

    case 'CLEAR_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload]: undefined,
        },
      }

    case 'SUBMIT_START':
      return {
        ...state,
        status: 'submitting',
        errorMessage: undefined,
      }

    case 'SUBMIT_SUCCESS':
      return {
        ...state,
        status: 'success',
        data: initialFormData,
        errors: {},
      }

    case 'SUBMIT_ERROR':
      return {
        ...state,
        status: 'error',
        errorMessage: action.payload,
      }

    case 'RESET':
      return initialState

    default:
      return state
  }
}

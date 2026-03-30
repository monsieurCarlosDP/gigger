import type { ValidatorRule } from '../types/fieldConfig'

export const validators = {
  required: (msg = 'Este campo es requerido'): ValidatorRule => (val: unknown) => {
    if (typeof val === 'string') {
      return val.trim() === '' ? msg : null
    }
    return !val ? msg : null
  },

  email: (msg = 'Email inválido'): ValidatorRule => (val: unknown) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return !emailRegex.test(val as string) ? msg : null
  },

  minLength: (min: number, msg?: string): ValidatorRule => (val: unknown) => {
    const message = msg || `Mínimo ${min} caracteres`
    return (val as string).length < min ? message : null
  },

  maxLength: (max: number, msg?: string): ValidatorRule => (val: unknown) => {
    const message = msg || `Máximo ${max} caracteres`
    return (val as string).length > max ? message : null
  },

  pattern: (regex: RegExp, msg: string): ValidatorRule => (val: unknown) => {
    return !regex.test(val as string) ? msg : null
  },

  min: (minVal: number, msg?: string): ValidatorRule => (val: unknown) => {
    const message = msg || `Mínimo ${minVal}`
    const numVal = Number(val)
    return isNaN(numVal) || numVal < minVal ? message : null
  },

  max: (maxVal: number, msg?: string): ValidatorRule => (val: unknown) => {
    const message = msg || `Máximo ${maxVal}`
    const numVal = Number(val)
    return isNaN(numVal) || numVal > maxVal ? message : null
  },

  custom: (fn: (val: unknown) => boolean, msg: string): ValidatorRule => (val: unknown) => {
    return !fn(val) ? msg : null
  },
}

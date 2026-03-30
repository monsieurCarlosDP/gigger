export type PersonRole = 'Novio' | 'Novia' | ''

export interface FormData {
  // Pareja
  person1Name: string
  person1Email: string
  person1Phone: string
  person1Role: PersonRole

  person2Name: string
  person2Email: string
  person2Phone: string
  person2Role: PersonRole

  // Evento
  StartDate: string
  EndDate: string
  Location: string
  Distance: string
  Notes: string
  Description: string

  // Contacto del lugar
  venueContactName: string
  venueContactPhone: string
  venueContactEmail: string
}

export const initialFormData: FormData = {
  person1Name: '',
  person1Email: '',
  person1Phone: '',
  person1Role: '',

  person2Name: '',
  person2Email: '',
  person2Phone: '',
  person2Role: '',

  StartDate: '',
  EndDate: '',
  Location: '',
  Distance: '',
  Notes: '',
  Description: '',

  venueContactName: '',
  venueContactPhone: '',
  venueContactEmail: '',
}

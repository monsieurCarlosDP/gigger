// Type exports from OpenAPI spec
export type EventType = 'Requested' | 'Event' | 'Viability'
export type GigType = 'Wedding' | 'Party' | 'Village' | 'Gig'

// Formulario de solicitud de evento (se guarda como Event con Type: 'Requested')
export interface EventRequest {
  Name: string
  Type: EventType
  StartDate: string
  EndDate?: string
  Location?: string
  Distance?: number
  GigType: GigType | ''
  ContactEmail: string
  ContactPhone?: string
  Notes?: string
}

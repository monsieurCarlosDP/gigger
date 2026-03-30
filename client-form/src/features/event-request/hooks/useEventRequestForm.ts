import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import type { FormData } from '../types/formData'

interface TagResponse {
  data: { documentId: string; Name: string }[]
}

interface PersonResponse {
  data: { documentId: string }
}

async function resolveTagId(roleName: string): Promise<string | undefined> {
  if (!roleName) return undefined
  const tags = await apiClient.get<TagResponse>(`/tags?filters[Name][$eq]=${encodeURIComponent(roleName)}`)
  return tags.data[0]?.documentId
}

async function createPerson(
  name: string,
  email: string,
  phone: string,
  tagId: string | undefined,
): Promise<string> {
  const res = await apiClient.post<PersonResponse>('/people', {
    data: {
      Name: name,
      Email: email,
      Number: phone || undefined,
      Type: 'Client',
      ...(tagId ? { tags: [tagId] } : {}),
    },
  })
  return res.data.documentId
}

export function useEventRequestForm() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      // 1. Resolver IDs de los tags Novio/Novia en paralelo
      const [tag1Id, tag2Id] = await Promise.all([
        resolveTagId(formData.person1Role),
        resolveTagId(formData.person2Role),
      ])

      // 2. Crear las dos personas de la pareja + contacto del lugar (si existe) en paralelo
      const hasVenueContact = !!formData.venueContactName.trim()

      const [person1Id, person2Id, venueContactId] = await Promise.all([
        createPerson(formData.person1Name, formData.person1Email, formData.person1Phone, tag1Id),
        createPerson(formData.person2Name, formData.person2Email, formData.person2Phone, tag2Id),
        hasVenueContact
          ? createPerson(formData.venueContactName, formData.venueContactEmail, formData.venueContactPhone, undefined)
          : Promise.resolve(null),
      ])

      const contacts = [person1Id, person2Id, ...(venueContactId ? [venueContactId] : [])]

      // 3. Crear el evento
      return apiClient.post<{ data: { documentId: string } }>('/events', {
        data: {
          Name: `Boda de ${formData.person1Name} y ${formData.person2Name}`,
          Type: 'Event',
          GigType: 'Wedding',
          EventStatus: 'Requested',
          StartDate: formData.StartDate || undefined,
          EndDate: formData.EndDate || undefined,
          Location: formData.Location || undefined,
          Distance: formData.Distance ? Number(formData.Distance) : undefined,
          Description: formData.Description || undefined,
          Notes: formData.Notes || undefined,
          contacts,
        },
      })
    },
  })
}

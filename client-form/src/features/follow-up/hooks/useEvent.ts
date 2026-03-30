import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'

export interface EventContact {
  documentId: string
  Name: string
  Email?: string
  Number?: string
  tags?: { documentId: string; Name: string; Color?: string }[]
}

export interface EventDetail {
  documentId: string
  Name: string
  StartDate?: string
  EndDate?: string
  Location?: string
  Description?: string
  Notes?: string
  EventStatus?: 'Requested' | 'Budgeted' | 'Accepted' | 'Cancelled'
  GigType?: string
  contacts?: EventContact[]
}

interface EventResponse {
  data: EventDetail
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () =>
      apiClient.get<EventResponse>(
        `/events/${id}?populate[contacts][populate]=tags`,
      ),
    select: (res) => res.data,
    enabled: !!id,
  })
}

import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import type { EventRequest } from '@/shared/types/api'

export function useEventRequestForm() {
  return useMutation({
    mutationFn: async (formData: EventRequest) => {
      // Crear evento con Type "Requested"
      return apiClient.post<{ data: unknown }>(
        '/events',
        { data: { ...formData, Type: 'Requested' } }
      )
    },
  })
}

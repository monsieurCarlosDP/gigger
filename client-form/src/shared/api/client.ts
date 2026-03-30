const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337/api'

export const apiClient = {
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data as T
  },

  async post<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data as T
  },
}

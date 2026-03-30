const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337/api'
const API_TOKEN = import.meta.env.VITE_API_TOKEN || ''

const headers = (): Record<string, string> => ({
  'Content-Type': 'application/json',
  ...(API_TOKEN ? { Authorization: `Bearer ${API_TOKEN}` } : {}),
})

export const apiClient = {
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: 'GET',
      headers: { ...headers(), ...options?.headers },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return response.json() as Promise<T>
  },

  async post<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: 'POST',
      headers: { ...headers(), ...options?.headers },
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return response.json() as Promise<T>
  },
}

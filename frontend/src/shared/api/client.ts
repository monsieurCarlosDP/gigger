import createClient from 'openapi-fetch';
import qs from 'qs';
import type { paths } from '../types/api';

const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:1337/api';

/** Source for Bearer token: set via setApiTokenGetter (e.g. from auth) or use VITE_API_TOKEN in .env */
let tokenGetter: (() => string | null) | null = null;

export function setApiTokenGetter(getter: () => string | null): void {
  tokenGetter = getter;
}

function getToken(): string | null {
  return tokenGetter?.() ?? import.meta.env.VITE_API_TOKEN ?? null;
}

const fetchClient = createClient<paths>({
  baseUrl,
  querySerializer: (params) => qs.stringify(params, { encodeValuesOnly: true }),
  fetch: (input: Request) => {
    const token = getToken();
    if (!token) return fetch(input);
    const headers = new Headers(input.headers);
    headers.set('Authorization', `Bearer ${token}`);
    return fetch(new Request(input, { headers }));
  },
});

/** Auth types */
export interface AvatarConfig {
  top: string;
  accessories?: string;
  accessoriesProbability?: number;
  facialHair?: string;
  facialHairProbability?: number;
  clothing: string;
  clothingGraphic?: string;
  eyes: string;
  eyebrows: string;
  mouth: string;
  skinColor: string;
  hairColor: string;
  clothesColor: string;
  facialHairColor: string;
  hatColor: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  displayName?: string;
  avatar?: AvatarConfig | null;
}

interface LoginResponse {
  jwt: string;
  user: AuthUser;
}

/** Helper for custom (non-openapi) endpoints with auth + error handling */
async function authFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const headers = new Headers(options?.headers);
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${baseUrl}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message ?? `Error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export interface DiscordChannel {
  id: string;
  name: string;
  categoryId: string | null;
  position: number;
}

export interface DiscordMessage {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar: string | null;
    bot: boolean;
  };
  timestamp: string;
  editedAt: string | null;
  attachments: { id: string; filename: string; url: string }[];
}

/** Query params for list endpoints (pagination, filters, etc.) */
export type ListQuery = paths['/events']['get']['parameters']['query'];
export type EventByIdQuery = paths['/events/{id}']['get']['parameters']['query'];
export type PeopleQuery = paths['/people']['get']['parameters']['query'];
export type PersonByIdQuery = paths['/people/{id}']['get']['parameters']['query'];
export type TarifDistancesQuery = paths['/tarif-distances']['get']['parameters']['query'];
export type TarifDistanceByIdQuery = paths['/tarif-distances/{id}']['get']['parameters']['query'];

/** Request body types for mutations */
export type CreateEventBody = NonNullable<paths['/events']['post']['requestBody']>['content']['application/json'];
export type UpdateEventBody = NonNullable<paths['/events/{id}']['put']['requestBody']>['content']['application/json'];

/**
 * API client with GET methods only. Use from custom hooks.
 */
export const api = {
  /** GET /events */
  getEvents(params?: { query?: ListQuery }) {
    return fetchClient.GET('/events', { params });
  },

  /** GET /events/{id} */
  getEventById(id: string, params?: { query?: EventByIdQuery }) {
    return fetchClient.GET('/events/{id}', { params: { path: { id }, query: params?.query } });
  },

  /** GET /people */
  getPeople(params?: { query?: PeopleQuery }) {
    return fetchClient.GET('/people', { params });
  },

  /** GET /people/{id} */
  getPersonById(id: string, params?: { query?: PersonByIdQuery }) {
    return fetchClient.GET('/people/{id}', { params: { path: { id }, query: params?.query } });
  },

  /** GET /price (single type) */
  getPrice() {
    return fetchClient.GET('/price');
  },

  /** GET /tarif-distances */
  getTarifDistances(params?: { query?: TarifDistancesQuery }) {
    return fetchClient.GET('/tarif-distances', { params });
  },

  /** GET /tarif-distances/{id} */
  getTarifDistanceById(id: string, params?: { query?: TarifDistanceByIdQuery }) {
    return fetchClient.GET('/tarif-distances/{id}', {
      params: { path: { id }, query: params?.query },
    });
  },

  /** POST /events */
  createEvent(body: CreateEventBody) {
    return fetchClient.POST('/events', { body });
  },

  /** PUT /events/{id} */
  updateEvent(id: string, body: UpdateEventBody) {
    return fetchClient.PUT('/events/{id}', { params: { path: { id } }, body });
  },

  /** DELETE /events/{id} */
  deleteEvent(id: string) {
    return fetchClient.DELETE('/events/{id}', { params: { path: { id } } });
  },

  /** POST /auth/local */
  login(identifier: string, password: string) {
    return authFetch<LoginResponse>('/auth/local', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
  },

  /** GET /users/me */
  getMe() {
    return authFetch<AuthUser>('/users/me?populate=avatar');
  },

  /** PUT /users/:id — update profile */
  updateMe(id: number, data: { username?: string; displayName?: string; avatar?: AvatarConfig }) {
    return authFetch<AuthUser>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /** POST /auth/change-password */
  changePassword(currentPassword: string, password: string, passwordConfirmation: string) {
    return authFetch<AuthUser>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, password, passwordConfirmation }),
    });
  },

  /** GET /discord/channels */
  getDiscordChannels() {
    return authFetch<{ data: DiscordChannel[] }>('/discord/channels');
  },

  /** GET /discord/channels/:channelId/messages */
  getDiscordMessages(channelId: string, options?: { before?: string; limit?: number }) {
    const params = new URLSearchParams();
    if (options?.limit) params.set('limit', String(options.limit));
    if (options?.before) params.set('before', options.before);
    const query = params.toString();
    return authFetch<{ data: DiscordMessage[] }>(`/discord/channels/${channelId}/messages${query ? `?${query}` : ''}`);
  },

  /** POST /discord/channels/:channelId/messages */
  sendDiscordMessage(channelId: string, content: string) {
    return authFetch<{ data: DiscordMessage }>(`/discord/channels/${channelId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },
};

export default api;

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
};

export default api;

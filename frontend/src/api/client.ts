import createClient from 'openapi-fetch';
import type { paths } from '../types/api';

const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:1337/api';

const fetchClient = createClient<paths>({ baseUrl });

/** Query params for list endpoints (pagination, filters, etc.) */
export type ListQuery = paths['/events']['get']['parameters']['query'];
export type EventByIdQuery = paths['/events/{id}']['get']['parameters']['query'];
export type PeopleQuery = paths['/people']['get']['parameters']['query'];
export type PersonByIdQuery = paths['/people/{id}']['get']['parameters']['query'];
export type TarifDistancesQuery = paths['/tarif-distances']['get']['parameters']['query'];
export type TarifDistanceByIdQuery = paths['/tarif-distances/{id}']['get']['parameters']['query'];

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
};

export default api;

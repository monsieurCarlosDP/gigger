/** Tipo de persona */
export type PersonType = 'Client' | 'Provider' | 'Manager';

/** Tag para agrupar personas */
export interface Tag {
  documentId: string;
  id: string | number;
  Name: string;
  Description?: string;
  Color?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt: string;
}

/** Datos de una persona */
export interface Person {
  documentId: string;
  id: string | number;
  Name?: string;
  Email?: string;
  Number?: string;
  Description?: string;
  Type?: PersonType;
  createdAt?: string;
  updatedAt?: string;
  publishedAt: string;
  events?: Array<{
    documentId: string;
    id: string | number;
    Name: string;
  }>;
  tags?: Tag[];
}

/** Respuesta del API para lista de personas */
export interface PeopleListResponse {
  data: Person[];
  meta?: {
    pagination?: {
      start: number;
      limit: number;
      total: number;
      count: number;
    };
  };
}

/** Respuesta del API para una persona individual */
export interface PersonDetailResponse {
  data: Person;
}

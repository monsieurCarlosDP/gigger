import { useReducer } from 'react';

export interface PersonFormState {
  Name: string;
  Email: string;
  Number: string;
  Description: string;
  Type: 'Client' | 'Provider' | 'Manager' | '';
  tags: { documentId: string; Name: string }[];
}

export type PersonFormAction =
  | { type: 'SET_FIELD'; field: keyof PersonFormState; value: string }
  | { type: 'SET_TAGS'; tags: { documentId: string; Name: string }[] };

export type PersonFormDispatch = (action: PersonFormAction) => void;

function personFormReducer(state: PersonFormState, action: PersonFormAction): PersonFormState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_TAGS':
      return { ...state, tags: action.tags };
    default:
      return state;
  }
}

export function usePersonForm(initialState: PersonFormState) {
  return useReducer(personFormReducer, initialState);
}

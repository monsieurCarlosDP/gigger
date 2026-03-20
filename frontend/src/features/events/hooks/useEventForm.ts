import { useReducer } from 'react';

/** Types matching Strapi schema */

type EventType = 'Event' | 'Viability';
type GigType = 'Wedding' | 'Party' | 'Village' | 'Gig';
export type EventStatus = 'Requested' | 'Accepted' | 'Cancelled';

export interface BudgetItem {
  Base: number | null;
  Equipment: boolean;
  Dietas: number | null;
  DJ: boolean;
  Accepted: boolean;
}

export interface LogisticStop {
  Time: string | null;
  Label: string;
  Description: string;
  Type: string;
  PickUpUser: string | null;
  DoneBy: string | null;
}

export interface ContactRef {
  documentId: string;
  Name: string;
}

export interface EventFormState {
  Name: string;
  Type: EventType;
  GigType: GigType | '';
  Location: string;
  Distance: string;
  StartDate: string;
  EndDate: string;
  Status: EventStatus;
  CancelledDate: string;
  DiscordChannelId: string;
  contacts: ContactRef[];
  Budget: BudgetItem[];
  Logistic: LogisticStop[];
}

/** Actions */

type Action =
  | { type: 'SET_FIELD'; field: keyof EventFormState; value: unknown }
  | { type: 'SET_CONTACT'; contacts: ContactRef[] }
  | { type: 'ADD_BUDGET'; defaults?: Partial<BudgetItem> }
  | { type: 'UPDATE_BUDGET'; index: number; field: keyof BudgetItem; value: unknown }
  | { type: 'REMOVE_BUDGET'; index: number }
  | { type: 'ADD_STOP'; defaults?: Partial<LogisticStop> }
  | { type: 'UPDATE_STOP'; index: number; field: keyof LogisticStop; value: unknown }
  | { type: 'REMOVE_STOP'; index: number }
  | { type: 'RESET'; state: EventFormState };

const EMPTY_BUDGET: BudgetItem = { Base: null, Equipment: false, Dietas: null, DJ: false, Accepted: false };
const EMPTY_STOP: LogisticStop = { Time: null, Label: '', Description: '', Type: '', PickUpUser: null, DoneBy: null };

function reducer(state: EventFormState, action: Action): EventFormState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };

    case 'SET_CONTACT':
      return { ...state, contacts: action.contacts };

    case 'ADD_BUDGET':
      return { ...state, Budget: [...state.Budget, { ...EMPTY_BUDGET, ...action.defaults }] };

    case 'UPDATE_BUDGET': {
      const Budget = state.Budget.map((b, i) =>
        i === action.index ? { ...b, [action.field]: action.value } : b,
      );
      return { ...state, Budget };
    }

    case 'REMOVE_BUDGET':
      return { ...state, Budget: state.Budget.filter((_, i) => i !== action.index) };

    case 'ADD_STOP':
      return { ...state, Logistic: [...state.Logistic, { ...EMPTY_STOP, ...action.defaults }] };

    case 'UPDATE_STOP': {
      const Logistic = state.Logistic.map((s, i) =>
        i === action.index ? { ...s, [action.field]: action.value } : s,
      );
      return { ...state, Logistic };
    }

    case 'REMOVE_STOP':
      return { ...state, Logistic: state.Logistic.filter((_, i) => i !== action.index) };

    case 'RESET':
      return action.state;

    default:
      return state;
  }
}

/** Initialize from API event data */
export function eventToFormState(event: Record<string, unknown>): EventFormState {
  return {
    Name: (event.Name as string) ?? '',
    Type: (event.Type as EventType) ?? 'Event',
    GigType: (event.GigType as GigType | '') ?? '',
    Location: (event.Location as string) ?? '',
    Distance: event.Distance != null ? String(event.Distance) : '',
    StartDate: (event.StartDate as string) ?? '',
    EndDate: (event.EndDate as string) ?? '',
    Status: (event.EventStatus as EventStatus) ?? 'Requested',
    CancelledDate: (event.CancelledDate as string) ?? '',
    DiscordChannelId: (event.DiscordChannelId as string) ?? '',
    contacts: Array.isArray(event.contacts)
      ? (event.contacts as ContactRef[]).map((c) => ({ documentId: c.documentId, Name: c.Name }))
      : [],
    Budget: Array.isArray(event.Budget)
      ? (event.Budget as BudgetItem[]).map((b) => ({
          Base: b.Base ?? null,
          Equipment: b.Equipment ?? false,
          Dietas: b.Dietas ?? null,
          DJ: b.DJ ?? false,
          Accepted: b.Accepted ?? false,
        }))
      : [],
    Logistic: Array.isArray(event.Logistic)
      ? (event.Logistic as Record<string, unknown>[]).map((s) => ({
          Time: (s.Time as string) ?? null,
          Label: (s.Label as string) ?? '',
          Description: (s.Description as string) ?? '',
          Type: (s.Type as string) ?? '',
          PickUpUser: (s.PickUpUser as Record<string, unknown>)?.documentId as string ?? null,
          DoneBy: (s.DoneBy as Record<string, unknown>)?.documentId as string ?? null,
        }))
      : [],
  };
}

export function useEventForm(initial: EventFormState) {
  return useReducer(reducer, initial);
}

export type EventFormDispatch = React.Dispatch<Action>;

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Note } from './types';

interface State {
  notes: Note[];
  page: number;
  totalPages: number;
  notification: string;
  cache: Record<number, Note[]>;
}

const initialState: State = {
  notes: [],
  page: 1,
  totalPages: 0,
  notification: 'Notification area',
  cache: {},
};

type Action =
  | { type: 'set-notes'; notes: Note[]; totalPages: number }
  | { type: 'set-page'; page: number }
  | { type: 'notification'; message: string }
  | { type: 'cache-page'; page: number; notes: Note[]; totalPages: number }
  | { type: 'use-cached'; page: number }
  | { type: 'drop-cache'; page: number };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'set-notes':
      return { ...state, notes: action.notes, totalPages: action.totalPages };
    case 'set-page':
      return { ...state, page: action.page };
    case 'notification':
      return { ...state, notification: action.message };
    case 'cache-page': {
      const newCache = { ...state.cache, [action.page]: action.notes } as Record<number, Note[]>;
      return { ...state, cache: newCache, notes: action.notes, totalPages: action.totalPages };
    }
    case 'use-cached':
      return { ...state, notes: state.cache[action.page] || [], page: action.page };
    case 'drop-cache': {
      const { [action.page]: _omit, ...rest } = state.cache;
      return { ...state, cache: rest };
    }
    default:
      return state;
  }
};

const NotesContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => {} });

export const useNotes = () => useContext(NotesContext);

export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <NotesContext.Provider value={{ state, dispatch }}>{children}</NotesContext.Provider>;
};
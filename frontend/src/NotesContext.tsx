import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Note } from './types';

interface State {
  notes: Note[];
  page: number;
  totalPages: number;
  notification: string;
}

const initialState: State = {
  notes: [],
  page: 1,
  totalPages: 1,
  notification: 'Notification area',
};

type Action =
  | { type: 'set-notes'; notes: Note[]; totalPages: number }
  | { type: 'set-page'; page: number }
  | { type: 'notification'; message: string };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'set-notes':
      return { ...state, notes: action.notes, totalPages: action.totalPages };
    case 'set-page':
      return { ...state, page: action.page };
    case 'notification':
      return { ...state, notification: action.message };
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
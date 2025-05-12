import React, { useEffect } from 'react';
import { NotesProvider, useNotes } from './NotesContext';
import { api } from './api';
import { Note } from './types';
import NotesList from './NotesList';
import Pagination from './Pagination';
import AddNewNote from './AddNewNote';

const POSTS_PER_PAGE = 10;

const headerToInt = (val: unknown): number => {
  if (typeof val === 'string') return parseInt(val, 10) || 0;
  if (Array.isArray(val) && typeof val[0] === 'string') return parseInt(val[0], 10) || 0;
  return 0;
};

function InnerApp() {
  const { state, dispatch } = useNotes();
  const { page } = state;

  const fetchPage = async (p = 1) => {
    const res = await api.get<Note[]>('/notes', {
      params: { _page: p, _per_page: POSTS_PER_PAGE },
    });
  
    let total = 0;
    if ('x-total-count' in res.headers) {
      total = Number(res.headers['x-total-count']) || 0;
      
    } else {
      console.warn('x-total-count header missing');
    }
  
    const pages = Math.max(1, Math.ceil(total / POSTS_PER_PAGE));
  
    if (p > pages) {
      dispatch({ type: 'set-page', page: 1 });
      return;
    }
  
    dispatch({ type: 'set-notes', notes: res.data, totalPages: pages });
  };

  /* Re‑fetch when current page changes */
  useEffect(() => {
    fetchPage(page);
  }, [page]);

  return (
    <div>
      <h1>Notes</h1>
      <div className="notification">{state.notification}</div>

      <AddNewNote onAdded={() => fetchPage(1)} />
      <NotesList onChange={() => fetchPage(page)} />
      <Pagination />
    </div>
  );
}

export default function App() {
  return (
    <NotesProvider>
      <InnerApp />
    </NotesProvider>
  );
}
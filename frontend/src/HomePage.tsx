import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotes } from './NotesContext';
import { useAuth } from './AuthContext';
import { api } from './api';
import { Note } from './types';
import NotesList from './NotesList';
import Pagination from './Pagination';
import AddNewNote from './AddNewNote';
import { useSanitizer } from './SanitizerContext';

const POSTS_PER_PAGE = 10;

export default function HomePage() {
  const { token, user, logout } = useAuth();
  const { state, dispatch } = useNotes();
  const { page, cache } = state as any; // we will extend state type later
  const { enabled: sanitizerOn, toggleSanitizer } = useSanitizer();
  const navigate = useNavigate();

  const pagesWindow = (pg: number, total: number) => {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    if (pg < 3) return [1, 2, 3, 4, 5];
    if (pg > total - 2) return [total - 4, total - 3, total - 2, total - 1, total];
    return [pg - 2, pg - 1, pg, pg + 1, pg + 2];
  };

  const fetchPage = async (p: number) => {
    const res = await api.get<Note[]>('/notes', { params: { _page: p, _per_page: POSTS_PER_PAGE } });
    const total = Number(res.headers['x-total-count'] ?? 0);
    const totalPages = Math.max(1, Math.ceil(total / POSTS_PER_PAGE));
    dispatch({ type: 'cache-page', page: p, notes: res.data, totalPages });
  };

  /* Fetch current page if not cached */
  useEffect(() => {
    if (!(cache as any)[page]) {
      fetchPage(page);
    } else {
      dispatch({ type: 'use-cached', page });
    }
  }, [page]);

  /* Prefetch window pages and cleanup cache when totalPages or page changes */
  useEffect(() => {
    if (state.totalPages === 0) return;
    const nums = pagesWindow(page, state.totalPages);
    nums.forEach((p) => {
      if (p !== page && !(cache as any)[p]) fetchPage(p);
    });
    Object.keys(cache as any).forEach((k) => {
      const numK = Number(k);
      if (!nums.includes(numK)) {
        dispatch({ type: 'drop-cache', page: numK });
      }
    });
  }, [page, state.totalPages]);

  return (
    <div>
      <h1>Notes</h1>
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={toggleSanitizer}
          data-testid="sanitizer_toggle"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: sanitizerOn ? '#4CAF50' : '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Sanitizer: {sanitizerOn ? 'ON' : 'OFF'}
        </button>
      </div>
      {!token && (
        <>
          <button data-testid="go_to_login_button" onClick={() => navigate('/login')}>Go to Login</button>
          <button data-testid="go_to_create_user_button" onClick={() => navigate('/create-user')}>
            Create New User
          </button>
        </>
      )}
      {token && (
        <button data-testid="logout" onClick={logout}>
          Logout
        </button>
      )}

      <div className="notification">{state.notification}</div>

      {token && <AddNewNote onAdded={() => fetchPage(1)} />}
      <NotesList onChange={() => fetchPage(page)} />
      <Pagination />
    </div>
  );
} 
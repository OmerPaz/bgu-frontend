import React from 'react';
import { useNotes } from './NotesContext';

export default function Pagination() {
  const { state, dispatch } = useNotes();
  const { page, totalPages } = state;

  const setPage = (p: number) => dispatch({ type: 'set-page', page: p });

  const windowPages = () => {
    if (totalPages === 1) return [1]; // handle empty DB / single page case
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page < 3) return [1, 2, 3, 4, 5];
    if (page > totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [page - 2, page - 1, page, page + 1, page + 2];
  };

  const nums = windowPages();

  return (

    <div>
      <button name="first" onClick={() => setPage(1)} disabled={page === 1}>
        First
      </button>
      <button name="previous" onClick={() => setPage(page - 1)} disabled={page === 1}>
        Previous
      </button>

      {nums.map((n) => (
        <button
          key={n}
          name={`page-${n}`}
          disabled={n === page}
          onClick={() => setPage(n)}
          style={{ fontWeight: n === page ? 'bold' : 'normal' }}
        >
          {n}
        </button>
      ))}

      <button name="next" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
        Next
      </button>
      <button name="last" onClick={() => setPage(totalPages)} disabled={page === totalPages}>
        Last
      </button>
    </div>
  );
}
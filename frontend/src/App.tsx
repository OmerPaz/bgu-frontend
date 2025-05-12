import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NotesList from './NotesList';
import Pagination from './Pagination';

const POSTS_PER_PAGE = 10;
const NOTES_URL = 'http://localhost:3001/notes';

function App() {
  const [notes, setNotes] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    // Fetch notes for the current page
    axios
      .get(NOTES_URL, {
        params: {
          _page: currentPage,
          _limit: POSTS_PER_PAGE
        }
      })
      .then(response => {
        // json-server returns 'X-Total-Count' for the total number of items
        const totalCount = response.headers['x-total-count'];
        setTotalPages(Math.ceil(Number(totalCount) / POSTS_PER_PAGE));
        setNotes(response.data);
      })
      .catch(err => {
        console.error('Error while fetching notes:', err);
      });
  }, [currentPage]);

  return (
    <div>
      <h1>My Notes</h1>
      <NotesList notes={notes} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onChangePage={setCurrentPage}
      />
    </div>
  );
}

export default App;
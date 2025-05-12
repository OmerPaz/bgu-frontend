import React, { useState } from 'react';
import { api } from './api';
import { useNotes } from './NotesContext';

export default function AddNewNote({ onAdded }: { onAdded: () => void }) {
  const { dispatch } = useNotes();
  const [adding, setAdding] = useState(false);
  const [content, setContent] = useState('');

  const save = async () => {
    await api.post('/notes', { title: 'new note', content, author: null });
    setAdding(false);
    setContent('');
    dispatch({ type: 'notification', message: 'Added a new note' });
    onAdded();
  };

  if (!adding) {
    return (
      <button name="add_new_note" onClick={() => setAdding(true)}>
        Add new note
      </button>
    );
  }
  return (
    <div>
      <textarea name="text_input_new_note" value={content} onChange={(e) => setContent(e.target.value)} />
      <button name="text_input_save_new_note" onClick={save}>
        Save
      </button>
      <button
        name="text_input_cancel_new_note"
        onClick={() => {
          setAdding(false);
          setContent('');
        }}
      >
        Cancel
      </button>
    </div>
  );
}
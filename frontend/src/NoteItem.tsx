import React, { useState } from 'react';
import { Note } from './types';
import { api } from './api';
import { useNotes } from './NotesContext';
import { useAuth } from './AuthContext';
import { useSanitizer } from './SanitizerContext';
import { sanitizeHtml } from './sanitizeHtml';

export default function NoteItem({ note, onChange }: { note: Note; onChange: () => void }) {
  const { dispatch } = useNotes();
  const { user } = useAuth();
  const { enabled: sanitizerOn } = useSanitizer();
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(note.content);
  const isAuthor = user && note.author?.email === user.email;

  const remove = async () => {
    await api.delete(`/notes/${note._id}`);
    dispatch({ type: 'notification', message: 'Note deleted' });
    onChange();
  };

  const save = async () => {
    await api.put(`/notes/${note._id}`, { content: val });
    setEditing(false);
    dispatch({ type: 'notification', message: 'Note updated' });
    onChange();
  };

  return (
    <div className="note" data-testid={note._id}>
      <h2>{note.title}</h2>
      <small>By {note.author?.name ?? 'Unknown'}</small>
      {!editing && (
        <div
          className="note-content"
          dangerouslySetInnerHTML={{
            __html: sanitizerOn ? sanitizeHtml(note.content) : note.content,
          }}
          data-testid={`content-${note._id}`}
        />
      )}
      {editing && (
        <textarea data-testid={`text_input-${note._id}`} value={val} onChange={(e) => setVal(e.target.value)} />
      )}
      {isAuthor && (
        <button data-testid={`delete-${note._id}`} onClick={remove}>
          Delete
        </button>
      )}
      {isAuthor && !editing && (
        <button data-testid={`edit-${note._id}`} onClick={() => setEditing(true)}>
          Edit
        </button>
      )}
      {editing && (
        <>
          <button data-testid={`text_input_save-${note._id}`} onClick={save}>
            Save
          </button>
          <button
            data-testid={`text_input_cancel-${note._id}`}
            onClick={() => {
              setEditing(false);
              setVal(note.content);
            }}
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );
}
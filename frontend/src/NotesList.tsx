import React from 'react';
import { useNotes } from './NotesContext';
import NoteItem from './NoteItem';

export default function NotesList({ onChange }: { onChange: () => void }) {
  const { state } = useNotes();
  return (
    <div>
      {state.notes.map((n) => (
        <NoteItem key={n._id} note={n} onChange={onChange} />
      ))}
    </div>
  );
}
import React from 'react';

interface Note {
  id: number;
  title: string;
  content: string;
  author: {
    name: string;
    email: string;
  };
}

interface NotesListProps {
  notes: Note[];
}

function NotesList({ notes }: NotesListProps) {
  return (
    <div>
      {notes.map(note => (
        <div className="note" id={String(note.id)} key={note.id}>
          <h2>{note.title}</h2>
          <small>By {note.author.name} ({note.author.email})</small>
          <br />
          {note.content}
        </div>
      ))}
    </div>
  );
}

export default NotesList;
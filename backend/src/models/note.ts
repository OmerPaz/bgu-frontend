import { Schema, model, Document } from 'mongoose';

export interface INote extends Document {
  title: string;
  author: { name: string; email: string } | null;
  content: string;
}

const NoteSchema = new Schema<INote>({
  title: { type: String, required: true },
  author: { name: String, email: String },
  content: { type: String, required: true }
}, { timestamps: true, versionKey: false });

export const Note = model<INote>('Note', NoteSchema);

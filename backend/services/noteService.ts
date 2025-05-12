import { INote, Note } from '../models/note.js';

export const getPaginatedNotes = async (page=1, per=10) => {
  const skip = (page-1)*per;
  const [notes,total] = await Promise.all([
    Note.find().sort({_id:-1}).skip(skip).limit(per).lean(),
    Note.countDocuments()
  ]);
  return { notes, total };
};

export const getNoteById = (id:string) => Note.findById(id);
export const createNote = (d:Partial<INote>) => Note.create(d);
export const updateNote = (id:string,d:Partial<INote>) => Note.findByIdAndUpdate(id,d,{new:true});
export const deleteNote = (id:string) => Note.findByIdAndDelete(id);
export const getNoteByIndex = (i:number) => Note.findOne().sort({_id:-1}).skip(i);

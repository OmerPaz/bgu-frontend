import fs from 'fs';
import path from 'path';
import request from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../src/expressApp';
import { connectMongo } from '../config/mongo';
import { Note } from '../models/note';

const app = createApp();
const LOG = path.resolve('log.txt');

beforeAll(async () => {
  process.env.MONGODB_CONNECTION_URL =
    process.env.MONGODB_CONNECTION_URL || 'mongodb://127.0.0.1:27017/testdb';
  await connectMongo();
  await Note.deleteMany({});
  if (fs.existsSync(LOG)) fs.unlinkSync(LOG);
});

afterAll(async () => {
  await mongoose.connection.db?.dropDatabase();
  await mongoose.disconnect();
});

describe('Backend spec compliance', () => {
  let id: string;

  it('dotenv loaded (URI exists)', () => {
    expect(process.env.MONGODB_CONNECTION_URL).toBeTruthy();
  });

  it('/health responds 200', async () => {
    await request(app).get('/health').expect(200);
  });

  it('POST /notes creates & returns 201', async () => {
    const res = await request(app)
      .post('/notes')
      .send({ title: 't1', content: 'c1', author: null });
    expect(res.status).toBe(201);
    id = res.body._id;
  });

  it('GET /notes/:id returns 200 with body', async () => {
    const res = await request(app).get(`/notes/${id}`).expect(200);
    expect(res.body._id).toBe(id);
  });

  it('PUT /notes/:id updates & returns 200', async () => {
    const res = await request(app)
      .put(`/notes/${id}`)
      .send({ content: 'updated' })
      .expect(200);
    expect(res.body.content).toBe('updated');
  });

  it('DELETE /notes/:id returns 204', async () => {
    await request(app).delete(`/notes/${id}`).expect(204);
  });

  it('pagination: creates 12 notes and returns X-Total-Count 12, 10 docs page', async () => {
    const bulk = Array.from({ length: 12 }, (_, i) => ({
      title: `t${i}`,
      content: `c${i}`,
      author: null,
    }));
    await Note.insertMany(bulk);

    const res = await request(app)
      .get('/notes')
      .query({ _page: 1, _per_page: 10 })
      .expect(200);

    expect(res.headers['x-total-count']).toBe('12');
    expect(res.body).toHaveLength(10);

    // ensure newest first
    const ids = res.body.map((n: any) => n._id);
    const sorted = [...ids].sort().reverse();
    expect(ids).toEqual(sorted);
  });

  it('logger writes a line to log.txt', () => {
    const txt = fs.readFileSync(LOG, 'utf8');
    expect(txt).toMatch(/POST \/notes/);
  });
});
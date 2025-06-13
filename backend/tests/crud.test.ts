import request from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../src/expressApp';
import { connectMongo } from '../config/mongo';

const app = createApp();
let createdId: string;

beforeAll(async () => {
  process.env.MONGODB_CONNECTION_URL ||= 'mongodb://127.0.0.1:27017/testdb';
  await connectMongo();
});

afterAll(async () => {
  await mongoose.connection.db?.dropDatabase();
  await mongoose.disconnect();
});

describe('CRUD flow', () => {
  it('create', async () => {
    const res = await request(app).post('/notes').send({ title: 't', content: 'c' });
    expect(res.status).toBe(201);
    createdId = res.body._id;
  });

  it('read', async () => {
    const res = await request(app).get(`/notes/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('t');
  });

  it('update', async () => {
    const res = await request(app).put(`/notes/${createdId}`).send({ content: 'u' });
    expect(res.body.content).toBe('u');
  });

  it('delete', async () => {
    const res = await request(app).delete(`/notes/${createdId}`);
    expect(res.status).toBe(204);
  });
});
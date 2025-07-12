import request from 'supertest';
import mongoose from 'mongoose';
//import { createApp } from '../src/expressApp';
import { connectMongo } from '../config/mongo';

//const app = createApp();
let createdId: string;

beforeAll(async () => {
  // You can set MONGODB_CONNECTION_URL in .env or skip DB connection for this placeholder test
  // await connectMongo();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('CRUD flow', () => {
  it('placeholder test (to be replaced with real CRUD tests)', () => {
    expect(true).toBe(true);
  });
});
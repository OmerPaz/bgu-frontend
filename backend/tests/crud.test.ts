import request from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../src/expressApp';
import { connectMongo } from '../config/mongo';

const app = createApp();
let createdId: string;

beforeAll(async () => {
  
});

afterAll(async () => {

});

describe('CRUD flow', () => {
  
});
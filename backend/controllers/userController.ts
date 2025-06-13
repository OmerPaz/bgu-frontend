import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';

const SALT_ROUNDS = 10;
const SECRET = process.env.JWT_SECRET || 'devsecret';

export const createUser = async (req: Request, res: Response) => {
  const { name, email, username, password } = req.body;
  if (!name || !email || !username || !password) {
    res.status(400).json({ error: 'missing fields' });
    return;
  }
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  try {
    const user = await User.create({ name, email, username, passwordHash });
    res.status(201).json({ id: user._id, name: user.name, email: user.email, username: user.username });
  } catch (err:any) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: 'missing credentials' });
    return;
  }
  const user = await User.findOne({ username });
  if (!user) {
    res.status(401).json({ error: 'invalid username or password' });
    return;
  }
  const passOk = await bcrypt.compare(password, user.passwordHash);
  if (!passOk) {
    res.status(401).json({ error: 'invalid username or password' });
    return;
  }
  const token = jwt.sign({ id: user._id, username: user.username }, SECRET, { expiresIn: '7d' });
  res.json({ token, name: user.name, email: user.email, username: user.username });
}; 
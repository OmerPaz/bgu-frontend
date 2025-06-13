import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';

const SECRET = process.env.JWT_SECRET || 'devsecret';

interface TokenPayload {
  id: string;
  username: string;
}

export const authRequired = async (req: Request, res: Response, next: NextFunction) => {
  const auth = req.get('Authorization');
  if (!auth?.toLowerCase().startsWith('bearer ')) {
    res.status(401).json({ error: 'token missing or invalid' });
    return;
  }
  const token = auth.substring(7);
  try {
    const decoded = jwt.verify(token, SECRET) as TokenPayload;
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401).json({ error: 'invalid token' });
      return;
    }
    (req as any).user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'token invalid' });
    return;
  }
}; 
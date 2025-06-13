import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'express-async-errors';

import { logger } from '../middlewares/logger.js';
import { noteRouter } from '../routes/noteRoutes.js';
import testRouter from '../routes/testRouter.js';
import userRouter from '../routes/userRoutes.js';

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      exposedHeaders: ['x-total-count'],
    })
  );
  app.use(express.json());
  app.use(logger);

  app.use('/notes', noteRouter);
  app.use('/', userRouter);

  app.get('/health', (_req: Request, res: Response) => {
    res.send('OK');
  });

  if (process.env.NODE_ENV === 'dev') {
    app.use('/test', testRouter);
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status ?? 500;
    res.status(status).json({ error: err.message ?? 'Internal Server Error' });
  });

  return app;
};
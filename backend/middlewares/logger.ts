import fs from 'fs';
import { Request, Response, NextFunction } from 'express';

export const logger = (req:Request,_res:Response,next:NextFunction)=>{
  const line = `${new Date().toISOString()} ${req.method} ${req.originalUrl} ${JSON.stringify(req.body)}\n`;
  fs.appendFile('log.txt', line, ()=>{});
  next();
};

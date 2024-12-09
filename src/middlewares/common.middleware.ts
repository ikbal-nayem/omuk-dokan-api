import { NextFunction, Request, Response } from 'express';
import path from 'path';

export const handleOptionCORS = (req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method == 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
};

export const mediaDir = (dir: string) => (req: Request, res: Response, next: NextFunction) => {
  req.mediaDir = path.join(process.env.MEDIA_ROOT!, dir);
  next();
};

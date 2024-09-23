import { NextFunction, Request, Response } from 'express';
import path from 'path';

export const mediaDir = (dir: string) => (req: Request, res: Response, next: NextFunction) => {
  req.mediaDir = path.join(process.env.MEDIA_ROOT!, dir);
  next();
};

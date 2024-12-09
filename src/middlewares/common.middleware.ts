import { NextFunction, Request, Response } from 'express';
import NextCors from 'nextjs-cors';
import path from 'path';

export async function CORShandler(req: Request, res: Response) {
  await NextCors(req, res, {
     // Options
     methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
     origin: '*',
     optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  res.json({ message: 'Hello NextJs Cors!' });
}

export const mediaDir = (dir: string) => (req: Request, res: Response, next: NextFunction) => {
  req.mediaDir = path.join(process.env.MEDIA_ROOT!, dir);
  next();
};

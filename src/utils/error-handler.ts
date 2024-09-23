import { Response } from 'express';

export const throwErrorResponse = (res: Response, error) => {
  return res.status(500).json({ success: false, error: error });
};

export const throwNotFoundResponse = (res: Response, message: string) => {
  return res.status(500).json({ success: false, message });
};

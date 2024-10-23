import { Response } from 'express';

export const throwServerErrorResponse = (res: Response, error) => {
  return res.status(500).json({ success: false, error: error, message: 'Internal server error.' });
};

export const throwBadRequestResponse = (res: Response, error) => {
  return res.status(400).json({ success: false, error: error, message: 'Bad request.' });
};

export const throwNotFoundResponse = (res: Response, message?: string) => {
  return res.status(404).json({ success: false, message: message || 'Not found.' });
};

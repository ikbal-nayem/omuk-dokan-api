import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import userModel from '@src/models/user.model';

export const auth = (req, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Role-based access control middleware
export const authorizeRoles = (...roles: string[]) => {
  return async (req, res: Response, next: NextFunction) => {
    const user = await userModel.findById(req.user.id);
    if (!user || !roles.some((role) => user.roles.includes(role))) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

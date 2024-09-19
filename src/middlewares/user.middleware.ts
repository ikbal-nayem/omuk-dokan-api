import { IUser } from '@src/interface/user.interface';
import userModel from '@src/models/user.model';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Unauthorized access!', success: false });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await userModel.findById(decoded?._id);
    if (!user || user?.isDeleted) {
      return res.status(401).json({ message: 'Invalid user', success: false });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token', success: false });
  }
};

// Role-based access control middleware
export const authorize = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req?.user;

    if (user?.isSuperAdmin) return next();
    if (!user || !roles.some((role) => user.roles.includes(role))) {
      return res.status(403).json({ message: 'Access denied', success: false });
    }
    next();
  };
};

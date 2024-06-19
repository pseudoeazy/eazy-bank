import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user';

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: IUser;
    }
  }
}

export const currentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const currentJwt = req?.session?.jwt as string;
    const payload = jwt.verify(currentJwt, process.env.JWT_KEY!) as UserPayload;
    const user = await User.findById(payload.id);

    if (user) {
      req.currentUser = user;
    }
  } catch (error) {}
  next();
};

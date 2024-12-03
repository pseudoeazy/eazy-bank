import { NextFunction, Request, Response } from 'express';
import { Password, TokenPayload } from '../services/password';

declare global {
  namespace Express {
    interface Request {
      authUser?: TokenPayload;
    }
  }
}

export default function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access Denied. No token provided');

  try {
    const payload = Password.verifyJWT(token);
    req.authUser = payload;
    next();
  } catch (error) {
    res.status(400).send('Invalid token provided.');
  }
}

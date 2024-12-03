import { Request, Response, NextFunction } from 'express';

function checkIsAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req?.authUser?.isAdmin) return res.status(403).send('Access denied.');
  next();
}

export default checkIsAdmin;

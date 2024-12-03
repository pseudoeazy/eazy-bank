import { Request, Response, NextFunction } from 'express';
import logger from '../startup/logger';

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err.stack);
  res.status(500).json({ message: err.message });
};

export default errorHandler;

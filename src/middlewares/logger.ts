import { Request, Response, NextFunction } from 'express';
function logger(req: Request, res: Response, next: NextFunction) {
  console.log('Logging ...');
  next();
}

export default logger;

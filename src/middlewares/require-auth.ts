import { Request, Response, NextFunction } from "express";

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.currentUser) {
    return res.status(401).send({ error: "You must login" });
  }
  next();
};

export { requireAuth };

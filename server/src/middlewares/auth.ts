import { Request, Response, NextFunction } from 'express';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  console.log("isAuthenticated", req.isAuthenticated());

  if (req.isAuthenticated()) {
    return next();
  }
  return next(new Error('Not authenticated'));
};

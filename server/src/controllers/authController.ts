import { NextFunction, Request, Response } from 'express';
import User, { IUser } from '../models/users';
import passport from 'passport';

export const authController = {
  googleCallback: (req: Request, res: Response) => {
    // Assuming the frontend is running on a different port or domain
    console.log(process.env.FRONTEND_URL);
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendURL}/profile`);
  },

  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return next(new Error('Email already in use'));
      }
      const user = new User({ name, email, password });
      await user.save();
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.status(201).json({ user: { id: user._id, name: user.name, email: user.email } });
      });
    } catch (error) {
      next(error);
    }
  },

  login: (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', (err: Error, user: IUser, info: { message: string }) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(new Error(info.message));
      }
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.json({ user: { id: user._id, name: user.name, email: user.email } });
      });
    })(req, res, next);
  },

  logout: (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.json({ message: 'Logged out successfully' });
    });
  }
};

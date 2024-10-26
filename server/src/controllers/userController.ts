import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/users';


export const getProfile = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    const user = req.user as IUser;
    res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } else {
    return next(new Error('Not authenticated'));
  }
};

export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return next(new Error('Not authenticated'));
  }

  try {
    const { newPassword } = req.body;
    const user = await User.findById((req.user as IUser)._id);

    if (!user) {
      return next(new Error('User not found'));
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const validateSession = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    const user = req.user as IUser;
    res.json({
      isAuthenticated: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } else {
    return next(new Error('Not authenticated'));
  }
};

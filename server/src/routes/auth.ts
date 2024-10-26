import { Router } from 'express';
import passport from 'passport';
import { authController } from '../controllers/authController';

const router = Router();

router.post('/register', (req, res, next) => {
  authController.register(req, res, next).catch(next);
});
router.post('/login', (req, res, next) => {
  authController.login(req, res, next);
});
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  authController.googleCallback
);

router.get('/logout', (req, res) => {
  console.log("Logging out user:", req.user);
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

export default router;

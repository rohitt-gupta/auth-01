import { Router } from 'express';
import * as userController from '../controllers/userController';
import { isAuthenticated } from '../middlewares/auth';

const router = Router();

router.get('/profile', isAuthenticated, (req, res, next) => {
  userController.getProfile(req, res, next);
});
router.post('/update-password', isAuthenticated, (req, res, next) => {
  userController.updatePassword(req, res, next);
});

router.get('/session', (req, res, next) => {
  userController.validateSession(req, res, next);
});



export default router;

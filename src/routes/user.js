import { Router } from 'express';

import {
  registerUser,
  authenticateUser,
  getCurrentUser,
  deleteUser,
} from '../controllers/user';

import checkAuth from '../middlewares/check-auth';
import { validateUserId } from '../middlewares/validateObjectId';

const router = Router();

router.post('/signup', registerUser);

router.post('/login', authenticateUser);

router.get('/', checkAuth, getCurrentUser);

router.delete('/:userId', [checkAuth, validateUserId], deleteUser);

export default router;

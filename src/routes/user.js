import { Router } from 'express';

import {
  registerUser,
  authenticateUser,
  deleteUser,
} from '../controllers/user';

import checkAuth from '../middlewares/check-auth';
import { validateUserId } from '../middlewares/validateObjectId';

const router = Router();

router.post('/signup', registerUser);

router.post('/login', authenticateUser);

router.delete('/:userId', [checkAuth, validateUserId], deleteUser);

export default router;

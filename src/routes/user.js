import { Router } from 'express';

import {
  registerUser,
  authenticateUser,
  getCurrentUser,
  deleteUser,
} from '../controllers/user';

// import admin from '../middlewares/admin';
import checkAuth from '../middlewares/check-auth';
import validateObjectId from '../middlewares/validateObjectId';

const router = Router();

router.post('/signup', registerUser);

router.post('/login', authenticateUser);

router.get('/me', checkAuth, getCurrentUser);

router.delete('/:id', [checkAuth, validateObjectId], deleteUser);

export default router;

import { Router } from 'express';

import {
  registerUser,
  authenticateUser,
  deleteUser,
} from '../controllers/user';

import { validateUserId } from '../middlewares/validateObjectId';

const router = Router();

router.post('/signup', registerUser);

router.post('/login', authenticateUser);

router.delete('/:userId', validateUserId, deleteUser);

export default router;

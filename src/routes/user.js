import { Router } from 'express';

import {
  registerUser,
  authenticateUser,
  deleteUser,
} from '../controllers/user';

const router = Router();

router.post('/signup', registerUser);

router.post('/login', authenticateUser);

router.delete('/:userId', deleteUser);

export default router;

import { Router } from 'express';

import {
  getOrders,
  getOrder,
  addOrder,
  deleteOrder,
} from '../controllers/orders';

import validateObjectId from '../middlewares/validateObjectId';
import checkAuth from '../middlewares/check-auth';
import admin from '../middlewares/admin';

const router = Router();

router.get('/', checkAuth, getOrders);

router.post('/', checkAuth, addOrder);

router.get('/:id', [checkAuth, validateObjectId], getOrder);

router.delete('/:id', [checkAuth, admin, validateObjectId], deleteOrder);

export default router;

import { Router } from 'express';

import {
  getOrders,
  getOrder,
  addOrder,
  deleteOrder,
} from '../controllers/orders';

import { validateOrderId } from '../middlewares/validateObjectId';
import checkAuth from '../middlewares/check-auth';

const router = Router();

router.get('/', checkAuth, getOrders);

router.post('/', checkAuth, addOrder);

router.get('/:orderId', [checkAuth, validateOrderId], getOrder);

router.delete('/:orderId', [checkAuth, validateOrderId], deleteOrder);

export default router;

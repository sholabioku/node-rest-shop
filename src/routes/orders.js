import { Router } from 'express';

import {
  getOrders,
  getOrder,
  addOrder,
  deleteOrder,
} from '../controllers/orders';
import checkAuth from '../middlewares/check-auth';

const router = Router();

router.get('/', checkAuth, getOrders);

router.post('/', checkAuth, addOrder);

router.get('/:orderId', checkAuth, getOrder);

router.delete('/:orderId', checkAuth, deleteOrder);

export default router;

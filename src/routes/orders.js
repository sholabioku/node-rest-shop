import { Router } from 'express';

const router = Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Orders were fetched',
  });
});

router.post('/', (req, res, next) => {
  const order = {
    productId: req.body.productId,
    quantity: req.body.quantity,
  };
  res.status(201).json({
    message: 'Order was created',
    order,
  });
});

router.get('/:orderId', (req, res, next) => {
  res.status(200).json({
    message: 'Order details',
    orderId: req.params.orderId,
  });
});

router.delete('/:orderId', (req, res, next) => {
  res.status(200).json({
    message: 'Order deleted',
    orderId: req.params.orderId,
  });
});

export default router;

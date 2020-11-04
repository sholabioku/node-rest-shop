import { Router } from 'express';

import Order from '../models/order';
import Product from '../models/product';
import asyncHandler from '../middlewares/async';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res, next) => {
    const docs = await Order.find().populate('product', 'name');
    const response = {
      counts: docs.length,
      orders: docs.map((doc) => {
        return {
          _id: doc._id,
          product: doc.product,
          quantity: doc.quantity,
          request: {
            type: 'GET',
            url: `http://localhost:3000/orders/${doc._id}`,
          },
        };
      }),
    };
    res.status(200).json(response);
  })
);

router.post(
  '/',
  asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.body.productId);
    if (!product) {
      return res
        .status(404)
        .json({ message: 'Product with the given ID not found' });
    }
    const order = new Order({
      quantity: req.body.quantity,
      product: req.body.productId,
    });

    const result = await order.save();
    res.status(201).json({
      message: 'Order was created',
      createdOrder: {
        _id: result._id,
        product: result.product,
        quantity: result.quantity,
      },
      request: {
        type: 'GET',
        url: `http://localhost:3000/orders/${result._id}`,
      },
    });
  })
);

router.get(
  '/:orderId',
  asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.orderId)
      .select('quantity product _id')
      .populate('product');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({
      order,
      request: {
        type: 'GET',
        url: 'http://localhost:3000/orders',
      },
    });
  })
);

router.delete(
  '/:orderId',
  asyncHandler(async (req, res, next) => {
    await Order.deleteMany({ _id: req.params.orderId });

    res.status(200).json({
      message: 'Order deleted',
      request: {
        type: 'POST',
        url: 'http://localhost:3000/orders',
        body: { productId: 'ID', quantity: 'Number' },
      },
    });
  })
);

export default router;

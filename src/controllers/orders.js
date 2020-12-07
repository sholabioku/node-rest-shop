import mongoose from 'mongoose';
import Order from '../models/order';
import Product from '../models/product';
import asyncHandler from '../middlewares/async';

export const getOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ customer: req.user._id }).populate(
    'product',
    'name'
  );

  const response = {
    counts: orders.length,
    orders: orders.map((order) => {
      return {
        _id: order._id,
        product: order.product,
        quantity: order.quantity,
        request: {
          type: 'GET',
          url: `http://localhost:3000/orders/${order._id}`,
        },
      };
    }),
  };
  res.status(200).json(response);
});

export const addOrder = asyncHandler(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.body.productId))
    return res.status(404).json({ message: 'Invalid ID' });

  const product = await Product.findById(req.body.productId);
  if (!product) {
    return res
      .status(404)
      .json({ message: `Product with id of ${req.body.productId} not found` });
  }
  const order = new Order({
    quantity: req.body.quantity,
    product: req.body.productId,
    customer: req.user._id,
  });

  const createdOrder = await order.save();
  res.status(201).json({
    message: 'Order was created',
    createdOrder: {
      _id: createdOrder._id,
      product: createdOrder.product,
      quantity: createdOrder.quantity,
    },
    request: {
      type: 'GET',
      url: `http://localhost:3000/orders/${createdOrder._id}`,
    },
  });
});

export const getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
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
});

export const deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  res.status(200).json({
    message: 'Order deleted',
    request: {
      type: 'POST',
      url: 'http://localhost:3000/orders',
      body: { productId: 'ID', quantity: 'Number' },
    },
  });
});

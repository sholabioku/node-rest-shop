import mongoose from 'mongoose';
import Order from '../models/order';
import Product from '../models/product';
import asyncHandler from '../middlewares/async';

export const getOrders = asyncHandler(async (req, res, next) => {
  const products = await Order.find().populate('product', 'name');
  const response = {
    counts: products.length,
    orders: products.map((product) => {
      return {
        _id: product._id,
        product: product.product,
        quantity: product.quantity,
        request: {
          type: 'GET',
          url: `http://localhost:3000/orders/${product._id}`,
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
});

export const deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findByIdAndDelete({ _id: req.params.orderId });
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

import mongoose from 'mongoose';

export const validateOrderId = (req, res, next) => {
  const id = req.params.orderId;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Invalid ID' });
  }
  next();
};

export const validateProductId = (req, res, next) => {
  const id = req.params.productId;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Invalid ID' });
  }
  next();
};

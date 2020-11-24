import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

export default mongoose.model('Order', orderSchema);

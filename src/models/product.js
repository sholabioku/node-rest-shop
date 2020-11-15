import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: 5,
    maxLength: 255,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  productImage: {
    type: String,
    required: true,
  },
});

export default mongoose.model('Product', productSchema);

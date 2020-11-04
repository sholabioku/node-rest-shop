import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
  name: String,
  price: {
    type: Number,
    required: true,
  },
});

export default mongoose.model('Product', productSchema);
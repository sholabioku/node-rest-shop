import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  name: String,
  price: Number,
});

export default mongoose.model('Product', productSchema);

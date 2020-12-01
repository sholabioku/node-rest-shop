import mongoose from 'mongoose';
import Product from '../../models/product';

const products = [
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'productOne',
    price: 2000,
    productImage: 'benz.png',
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'productTwo',
    price: 1000,
    productImage: 'laptop.png',
  },
];

const populateProducts = (done) => {
  Product.deleteMany({})
    .then(() => {
      return Product.insertMany(products);
    })
    .then(() => done());
};

export { products, populateProducts };

import _ from 'lodash';
import Product from '../models/product';
import asyncHandler from '../middlewares/async';

export const getProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find().select('name price productImage _id');
  const response = {
    count: products.length,
    products: products.map((product) => {
      return {
        name: product.name,
        price: product.price,
        productImage: product.productImage,
        _id: product._id,
        request: {
          type: 'GET',
          url: `http://localhost:3000/products/${product._id}`,
        },
      };
    }),
  };
  res.status(200).json(response);
});

export const addProduct = asyncHandler(async (req, res, next) => {
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });

  const createdProduct = await product.save();
  res.status(201).json({
    message: 'Product created successfully',
    createdProduct: {
      name: createdProduct.name,
      price: createdProduct.price,
      productImage: createdProduct.productImage,
      _id: createdProduct._id,
      request: {
        type: 'GET',
        url: `http://localhost:3000/products/${createdProduct._id}`,
      },
    },
  });
});

export const getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id).select(
    'name price productImage _id'
  );

  if (!product) return res.status(404).json({ message: 'No product found' });

  res.status(200).json({
    product,
    request: {
      type: 'GET',
      url: 'http://localhost:3000/products',
    },
  });
});

export const editProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const body = _.pick(req.body, ['name', 'price']);
  const product = await Product.findOneAndUpdate(
    { _id: id },
    { $set: body },
    { new: true }
  );

  if (!product) return res.status(404).json({ message: 'No product found' });

  res.status(200).json({
    message: 'Product updated successfully',
    request: {
      type: 'GET',
      url: `http://localhost:3000/products/${id}`,
    },
  });
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findOneAndDelete({ _id: id });
  if (!product) return res.status(404).json({ message: 'No product found' });

  res.status(200).json({
    message: 'Product deleted',
    request: {
      type: 'POST',
      url: 'http://localhost:3000/products',
      body: { name: 'String', price: 'Number' },
    },
  });
});

import mongoose from 'mongoose';
import _ from 'lodash';
import Product from '../models/product';
import asyncHandler from '../middlewares/async';

export const getProducts = asyncHandler(async (req, res, next) => {
  const docs = await Product.find().select('name price productImage _id');
  const response = {
    count: docs.length,
    products: docs.map((doc) => {
      return {
        name: doc.name,
        price: doc.price,
        productImage: doc.productImage,
        _id: doc._id,
        request: {
          type: 'GET',
          url: `http://localhost:3000/products/${doc._id}`,
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

  const result = await product.save();
  res.status(201).json({
    message: 'Product created successfully',
    createdProduct: {
      name: result.name,
      price: result.price,
      productImage: result.productImage,
      _id: result._id,
      request: {
        type: 'GET',
        url: `http://localhost:3000/products/${result._id}`,
      },
    },
  });
});

export const getProduct = asyncHandler(async (req, res, next) => {
  const id = req.params.productId;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Invalid ID' });
  }

  const doc = await Product.findById(id).select('name price productImage _id');
  if (!doc) {
    return res
      .status(404)
      .json({ message: 'No valid enrty found for the provided ID' });
  }

  res.status(200).json({
    product: doc,
    request: {
      type: 'GET',
      url: 'http://localhost:3000/products',
    },
  });
});

export const editProduct = asyncHandler(async (req, res, next) => {
  const id = req.params.productId;
  const body = _.pick(req.body, ['name', 'price']);

  await Product.updateOne({ _id: id }, { $set: body }, { new: true });

  res.status(200).json({
    message: 'Product updated successfully',
    request: {
      type: 'GET',
      url: `http://localhost:3000/products/${id}`,
    },
  });
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
  const id = req.params.productId;
  await Product.deleteMany({ _id: id });

  res.status(200).json({
    message: 'Product deleted',
    request: {
      type: 'POST',
      url: 'http://localhost:3000/products',
      body: { name: 'String', price: 'Number' },
    },
  });
});

import { Router } from 'express';
import mongoose from 'mongoose';
import _ from 'lodash';
import multer from 'multer';

import Product from '../models/product';
import asyncHandler from '../middlewares/async';

const router = Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './src/uploads/');
  },
  filename(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

router.get(
  '/',
  asyncHandler(async (req, res, next) => {
    const docs = await Product.find().select('name price _id');
    const response = {
      count: docs.length,
      products: docs.map((doc) => {
        return {
          name: doc.name,
          price: doc.price,
          _id: doc._id,
          request: {
            type: 'GET',
            url: `http://localhost:3000/products/${doc._id}`,
          },
        };
      }),
    };
    res.status(200).json(response);
  })
);

router.post(
  '/',
  upload.single('productImage'),
  asyncHandler(async (req, res, next) => {
    console.log(req.file);
    const body = _.pick(req.body, ['name', 'price']);

    const product = new Product(body);

    const result = await product.save();
    res.status(201).json({
      message: 'Product created successfully',
      createdProduct: {
        name: result.name,
        price: result.price,
        _id: result._id,
        request: {
          type: 'GET',
          url: `http://localhost:3000/products/${result._id}`,
        },
      },
    });
  })
);

router.get(
  '/:productId',
  asyncHandler(async (req, res, next) => {
    const id = req.params.productId;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Invalid ID' });
    }

    const doc = await Product.findById(id).select('name price _id');
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
  })
);

router.patch(
  '/:productId',
  asyncHandler(async (req, res, next) => {
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
  })
);

router.delete(
  '/:productId',
  asyncHandler(async (req, res, next) => {
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
  })
);

export default router;

import { Router } from 'express';
import mongoose from 'mongoose';
import _ from 'lodash';

import Product from '../models/product';
import asyncHandler from '../middlewares/async';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res, next) => {
    const docs = await Product.find();
    res.status(200).json(docs);
  })
);

router.post(
  '/',
  asyncHandler(async (req, res, next) => {
    const body = _.pick(req.body, ['name', 'price']);

    const product = new Product(body);

    const result = await product.save();
    res.status(201).json({
      message: 'Handling POST requets for /products',
      createdProduct: result,
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

    const doc = await Product.findById(id);
    if (!doc) {
      return res
        .status(404)
        .json({ message: 'No valid enrty found for the provided ID' });
    }

    res.status(200).json(doc);
  })
);

router.patch(
  '/:productId',
  asyncHandler(async (req, res, next) => {
    const id = req.params.productId;
    const body = _.pick(req.body, ['name', 'price']);

    const result = await Product.updateOne(
      { _id: id },
      { $set: body },
      { new: true }
    );

    res.status(200).json(result);
  })
);

router.delete(
  '/:productId',
  asyncHandler(async (req, res, next) => {
    const id = req.params.productId;
    const result = await Product.deleteMany({ _id: id });

    res.status(200).json(result);
  })
);

export default router;

import { Router } from 'express';
import mongoose from 'mongoose';
import _ from 'lodash';

import asyncHandler from '../middlewares/async';
import User from '../models/user';

const router = Router();

router.post(
  '/signup',
  asyncHandler(async (req, res, next) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).json({ message: 'User already exist' });

    user = new User({
      email: req.body.email,
      password: req.body.password,
    });
    const result = await user.save();
    console.log(result);
    res.status(201).json({ message: 'User created successfully' });
  })
);

router.delete(
  '/:userId',
  asyncHandler(async (req, res, next) => {
    await User.deleteOne({ id: req.params.userId });

    res.status(200).json({ message: 'User deleted' });
  })
);

export default router;

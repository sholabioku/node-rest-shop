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

export default router;

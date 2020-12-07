import asyncHandler from '../middlewares/async';
import User from '../models/user';

export const registerUser = asyncHandler(async (req, res, next) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).json({ message: 'User already exist' });

  user = new User({
    email: req.body.email,
    password: req.body.password,
  });
  await user.save();
  res.status(201).json({ message: 'User created successfully' });
});

export const authenticateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(401).json({ message: 'Auth failed' });

  const isMatch = await user.matchPassword(req.body.password);
  if (!isMatch) return res.status(401).json({ message: 'Auth failed' });

  const token = await user.generateAuthToken();

  res.status(200).json({ message: 'Auth successfull', token });
});

export const getCurrentUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('-password');
  res.status(200).json(user);
});

export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  await User.deleteOne({ _id: req.params.userId });

  res.status(200).json({ message: 'User deleted' });
});

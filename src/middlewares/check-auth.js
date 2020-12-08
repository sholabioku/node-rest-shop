import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  try {
    const token = req.header('auth');
    if (!token) return res.status(401).json({ message: 'Auth failed' });

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Invalid token' });
  }
};

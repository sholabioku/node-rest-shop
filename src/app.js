import express, { urlencoded, json } from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';

import productRoutes from './routes/products';
import orderRoutes from './routes/orders';

const app = express();

const url = 'mongodb://localhost:27017/ShopApi';

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`MongoDB Connected to ${url}`.cyan.underline.bold);
  })
  .catch((err) => {
    console.log('MongoDB connection failed...', err);
  });

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(urlencoded({ extended: false }));
app.use(json());
app.use(cors());

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

export default app;

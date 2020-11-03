import express, { urlencoded, json } from 'express';
import morgan from 'morgan';
import cors from 'cors';

import { error404, error500 } from './middlewares/errors';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import connectDB from './config/db';

require('express-async-errors');

connectDB();

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(urlencoded({ extended: false }));
app.use(json());
app.use(cors());

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use(error404);

app.use(error500);

export default app;

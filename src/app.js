import express, { urlencoded, json } from 'express';
import morgan from 'morgan';
import cors from 'cors';

import { notFoundError, serverError } from './middlewares/errors';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import userRoutes from './routes/user';
import connectDB from './config/db';

connectDB();

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use('/uploads', express.static('src/uploads'));
app.use(urlencoded({ extended: false }));
app.use(json());
app.use(cors());

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.use(notFoundError);

app.use(serverError);

export default app;

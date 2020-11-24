import express, { urlencoded, json } from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import hpp from 'hpp';
import xss from 'xss-clean';

import { notFoundError, serverError } from './middlewares/errors';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import userRoutes from './routes/user';
import connectDB from './config/db';

require('./config/config');

connectDB();

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use('/uploads', express.static('src/uploads'));
app.use(urlencoded({ extended: false }));
app.use(json());
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(limiter);

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.use(notFoundError);

app.use(serverError);

export default app;

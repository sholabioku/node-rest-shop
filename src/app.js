import express from 'express';
import morgan from 'morgan';

import productRoutes from './routes/products';
import orderRoutes from './routes/orders';

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

export default app;

import express from 'express';

import productRoutes from './routes/products';
import orderRoutes from './routes/orders';

const app = express();

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

export default app;

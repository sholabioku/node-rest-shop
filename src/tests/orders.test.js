import mongoose from 'mongoose';
import expect from 'expect';
import request from 'supertest';

import server from '../server';
import User from '../models/user';
import Order from '../models/order';
import Product from '../models/product';

describe('Integration test for orders routes', () => {
  describe('GET /orders', () => {
    it('should return 401 if client is not logged in', async () => {
      const res = await request(server).get('/orders');
      expect(res.status).toBe(401);
    });

    it('should get all orders created by a client', async () => {
      const orders = [
        {
          productId: mongoose.Types.ObjectId(),
          quantity: 4,
        },
        {
          productId: mongoose.Types.ObjectId(),
          quantity: 2,
        },
      ];

      await Order.collection.insertMany(orders);

      const token = new User().generateAuthToken();
      const res = await request(server).get('/orders').set('auth', token);
      expect(res.status).toBe(200);
    });
  });

  describe('GET /orders/:orderId', () => {
    it('should return 401 if client is not logged in', async () => {
      const res = await request(server).get('/orders/:orderId');
      expect(res.status).toBe(401);
    });

    it('should return order if valid id is passed', async () => {
      const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: 'Benz',
        price: 1200,
        productImage: 'benz.png',
      });
      await product.save();

      const order = new Order({
        product,
        quantity: 2,
        customer: mongoose.Types.ObjectId(),
      });

      await order.save();
      const token = new User().generateAuthToken();
      const res = await request(server)
        .get(`/orders/${order._id}`)
        .set('auth', token);
      expect(res.status).toBe(200);
    });

    it('should return 404 if invalid id is passed', async () => {
      const token = new User().generateAuthToken();
      const res = await request(server)
        .get('/orders/123abc')
        .set('auth', token);
      expect(res.status).toBe(404);
    });

    it('should return 404 if id passed does not has order', async () => {
      const token = new User().generateAuthToken();
      const id = new mongoose.Types.ObjectId();
      const res = await request(server).get(`/orders/${id}`).set('auth', token);
      expect(res.status).toBe(404);
    });
  });
});

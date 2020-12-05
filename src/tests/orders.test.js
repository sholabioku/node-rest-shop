import mongoose from 'mongoose';
import expect from 'expect';
import request from 'supertest';

import server from '../server';
import User from '../models/user';
import Product from '../models/product';
import Order from '../models/order';

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
  });
});

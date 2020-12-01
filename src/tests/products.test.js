import mongoose from 'mongoose';
import expect from 'expect';
import request from 'supertest';

import server from '../server';
import Product from '../models/product';
import User from '../models/user';
import { products, populateProducts } from './seed/seed';

describe('Integration Test for Product', () => {
  describe('GET /products', () => {
    beforeEach(populateProducts);
    it('should return all products', async () => {
      const res = await request(server).get('/products');
      expect(res.status).toBe(200);
      expect(res.body.products.length).toBe(2);
    });
  });

  describe('GET /products/:productId', () => {
    it('should return a product if valid id is passed', async () => {
      const res = await request(server).get(`/products/${products[0]._id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('product.name', products[0].name);
    });

    it('should return 404 if invalid id is passed', async () => {
      const res = await request(server).get('/products/123');
      expect(res.status).toBe(404);
    });

    it('should return 404 if product with the given productId not found', async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get(`/products/${id}`);
      expect(res.status).toBe(404);
    });
  });

  describe('POST /products', () => {
    it('should return 401 if client is not logged in', async () => {
      const res = await request(server).post('/products').send(products[0]);
      expect(res.status).toBe(401);
    });

    it('should return 403 if client is not admin', async () => {
      const token = new User({ isAdmin: false }).generateAuthToken();
      const res = await request(server)
        .post('/products')
        .set('auth', token)
        .send(products[0]);
      expect(res.status).toBe(403);
    });

    it('should save the product if it is valid', async () => {
      const token = new User({ isAdmin: true }).generateAuthToken();
      await request(server)
        .post('/products')
        .set('auth', token)
        .send(products[0]);

      const product = await Product.find(products[0]);

      expect(product).not.toBeNull();
    });
  });
});

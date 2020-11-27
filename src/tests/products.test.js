import expect from 'expect';
import request from 'supertest';

import server from '../server';
import Product from '../models/product';
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
      console.log(res.body);
    });
  });
});

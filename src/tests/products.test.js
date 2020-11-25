import expect from 'expect';
import request from 'supertest';

import server from '../server';
import { products, populateProducts } from './seed/seed';

describe('Integration Test for Product', () => {
  beforeEach(populateProducts);
  describe('GET /products', () => {
    it('should return all products', async () => {
      const res = await request(server).get('/products');
      expect(res.status).toBe(200);
      expect(res.body.products.length).toBe(2);
    });
  });
});

import expect from 'expect';
import request from 'supertest';

import server from '../server';
import Product from '../models/product';

describe('Integration Test for Product', () => {
  describe('GET /products', () => {
    const products = [
      {
        name: 'productOne',
        price: 2000,
        productImage: 'benz.png',
      },
      {
        name: 'productTwo',
        price: 1000,
        productImage: 'laptop.png',
      },
    ];

    it('should return all products', async () => {
      await Product.collection.insertMany(products);

      const res = await request(server).get('/products');
      expect(res.status).toBe(200);
      expect(res.body.products.length).toBe(2);
      await Product.collection.deleteMany({});
    });
  });
});

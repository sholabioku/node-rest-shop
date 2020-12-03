import mongoose from 'mongoose';
import expect from 'expect';
import request from 'supertest';

import server from '../server';
import Product from '../models/product';
import User from '../models/user';
// import { products, populateProducts } from './seed/seed';

describe('Integration Test for Product', () => {
  afterEach(async () => {
    await Product.deleteMany({});
  });
  describe('GET /products', () => {
    it('should return all products', async () => {
      const products = [
        {
          _id: new mongoose.Types.ObjectId(),
          name: 'productOne',
          price: 2000,
          productImage: 'benz.png',
        },
        {
          _id: new mongoose.Types.ObjectId(),
          name: 'productTwo',
          price: 1000,
          productImage: 'laptop.png',
        },
      ];

      await Product.collection.insertMany(products);
      const res = await request(server).get('/products');
      expect(res.status).toBe(200);
      expect(res.body.products.length).toBe(2);
    });
  });

  describe('GET /products/:productId', () => {
    it('should return a product if valid id is passed', async () => {
      const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: 'productOne',
        price: 2000,
        productImage: 'benz.png',
      });
      await product.save();
      const res = await request(server).get(`/products/${product._id}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('product.name', product.name);
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
      const res = await request(server).post('/products').send({
        _id: new mongoose.Types.ObjectId(),
        name: 'productOne',
        price: 2000,
        productImage: 'benz.png',
      });
      expect(res.status).toBe(401);
    });

    it('should return 403 if client is not admin', async () => {
      const token = new User({ isAdmin: false }).generateAuthToken();
      const res = await request(server)
        .post('/products')
        .set('auth', token)
        .send({
          _id: new mongoose.Types.ObjectId(),
          name: 'productOne',
          price: 2000,
          productImage: 'benz.png',
        });
      expect(res.status).toBe(403);
    });

    it('should save the product if it is valid', async () => {
      const token = new User({ isAdmin: true }).generateAuthToken();
      await request(server).post('/products').set('auth', token).send({
        _id: new mongoose.Types.ObjectId(),
        name: 'productOne',
        price: 2000,
        productImage: 'benz.png',
      });

      const product = await Product.find({
        _id: new mongoose.Types.ObjectId(),
        name: 'productOne',
        price: 2000,
        productImage: 'benz.png',
      });

      expect(product).not.toBeNull();
    });
  });

  describe.skip('PATCH /productId', () => {
    const updatedProduct = {
      name: 'Range Rover',
      price: 2500,
      productImage: 'rangerover.jpg',
    };
    it('should return 401 if client is not logged in', async () => {
      const res = await request(server)
        .patch(`/products/${products[0]._id}`)
        .send(updatedProduct);
      expect(res.status).toBe(401);
    });

    it('should return 403 if client is not admin', async () => {
      const token = new User({ isAdmin: false }).generateAuthToken();
      const res = await request(server)
        .patch(`/products/${products[0]._id}`)
        .set('auth', token)
        .send(updatedProduct);
      expect(res.status).toBe(403);
    });

    it('should return 404 if invalid id is passed', async () => {
      const token = new User({ isAdmin: true }).generateAuthToken();
      const res = await request(server)
        .patch('/products/123abc')
        .set('auth', token)
        .send(updatedProduct);
      expect(res.status).toBe(404);
    });

    it('should return 404 if product with the given productId not found', async () => {
      const id = new mongoose.Types.ObjectId();
      const token = new User({ isAdmin: true }).generateAuthToken();
      const res = await request(server)
        .patch(`/products/${id}`)
        .set('auth', token)
        .send(updatedProduct);
      expect(res.status).toBe(404);
    });

    it('should update the product', async () => {
      const token = new User({ isAdmin: true }).generateAuthToken();
      const res = await request(server)
        .patch(`/products/${products[0]._id}`)
        .set('auth', token)
        .send(updatedProduct);
      expect(res.status).toBe(200);
    });
  });
});

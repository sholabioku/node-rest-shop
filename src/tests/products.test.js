import mongoose from 'mongoose';
import expect from 'expect';
import request from 'supertest';

import server from '../server';
import Product from '../models/product';
import User from '../models/user';

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
    let token;
    let name;
    let price;
    let productImage;

    const exec = async () => {
      const res = await request(server)
        .post('/products')
        .set('auth', token)
        .send({ name, price, productImage });

      return res;
    };

    beforeEach(() => {
      token = new User({ isAdmin: true }).generateAuthToken();
      name = 'Benz';
      price = 2000;
      productImage = 'benz.png';
    });

    it('should return 401 if client is not logged in', async () => {
      token = '';

      const res = await exec();
      expect(res.status).toBe(401);
    });

    it('should return 403 if client is not admin', async () => {
      token = new User({ isAdmin: false }).generateAuthToken();
      const res = await exec();
      expect(res.status).toBe(403);
    });

    it('should save the product if it is valid', async () => {
      await exec();

      const product = await Product.find({ name, price, productImage });

      expect(product).not.toBeNull();
    });
  });

  describe('PATCH /products/productId', () => {
    let token;
    let product;
    let newName;
    let newPrice;
    let newProductImage;
    let id;

    const exec = async () => {
      const res = await request(server)
        .patch(`/products/${id}`)
        .set('auth', token)
        .send({
          name: newName,
          price: newPrice,
          productImage: newProductImage,
        });

      return res;
    };

    beforeEach(async () => {
      product = new Product({
        name: 'Benz',
        price: 2000,
        productImage: 'benz.jpg',
      });
      await product.save();

      id = product._id;
      token = new User({ isAdmin: true }).generateAuthToken();
      newName = 'Laptop';
      newPrice = 2500;
      newProductImage = 'laptop.jpg';
    });

    it('should return 401 if client is not logged in', async () => {
      token = '';
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it('should return 403 if client is not admin', async () => {
      token = new User({ isAdmin: false }).generateAuthToken();
      const res = await exec();
      expect(res.status).toBe(403);
    });

    it('should return 404 if invalid id is passed', async () => {
      id = '123abc';
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it('should return 404 if product with the given productId not found', async () => {
      id = new mongoose.Types.ObjectId();

      const res = await exec();
      expect(res.status).toBe(404);
    });

    it('should update the product', async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });
  });

  describe('DELETE /products/:productId', () => {
    let token;
    let product;
    let id;
    const exec = async () => {
      const res = await request(server)
        .delete(`/products/${id}`)
        .set('auth', token)
        .send();

      return res;
    };

    beforeEach(async () => {
      product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: 'productOne',
        price: 2000,
        productImage: 'benz.png',
      });

      await product.save();

      id = product._id;
      token = new User({ isAdmin: true }).generateAuthToken();
    });

    it('should return 401 if client is not logged in', async () => {
      token = '';
      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 403 if client is not admin', async () => {
      token = new User({ isAdmin: false }).generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it('should return 404 if id is invalid', async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 404 if no product with the given id was found', async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should delete the product if input is valid', async () => {
      await exec();

      const productInDb = await Product.findById(id);

      expect(productInDb).toBeNull();
    });
  });
});

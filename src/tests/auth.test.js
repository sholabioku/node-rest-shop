import mongoose from 'mongoose';
import expect from 'expect';
import request from 'supertest';

import server from '../server';
import Product from '../models/product';
import User from '../models/user';
import { products, populateProducts } from './seed/seed';

describe('check-auth middlewrae', () => {
  beforeEach(populateProducts);
  it('should return 401 if no token is provided', async () => {
    const res = await request(server).post('/products').send(products[0]);
    expect(res.status).toBe(401);
  });

  it('should return 400 if invalid token is provided', async () => {
    // const token = new User().generateAuthToken();
    const res = await request(server)
      .post('/products')
      .set('auth', 'a')
      .send(products[0]);
    expect(res.status).toBe(400);
  });
});

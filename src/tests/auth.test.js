import expect from 'expect';
import request from 'supertest';

import server from '../server';

describe('check-auth middlewrae', () => {
  it('should return 401 if no token is provided', async () => {
    const res = await request(server).post('/products').send({
      name: 'productOne',
      price: 2000,
      productImage: 'benz.png',
    });
    expect(res.status).toBe(401);
  });

  it('should return 400 if invalid token is provided', async () => {
    const res = await request(server).post('/products').set('auth', 'a').send({
      name: 'productOne',
      price: 2000,
      productImage: 'benz.png',
    });
    expect(res.status).toBe(400);
  });
});

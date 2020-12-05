import expect from 'expect';
import request from 'supertest';

import server from '../server';
import User from '../models/user';

describe('Integration test for orders routes', () => {
  describe('GET /orders', () => {
    it('should return 401 if client is not logged in', async () => {
      const res = await request(server).get('/orders');
      expect(res.status).toBe(401);
    });
  });
});

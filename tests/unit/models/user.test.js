import expect from 'expect';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import User from '../../../src/models/user';

require('../../../src/config/config');

describe('User model test', () => {
  describe('user.generateAuthToken', () => {
    it('should return valid jwt', async () => {
      const payload = {
        _id: mongoose.Types.ObjectId().toHexString(),
        isAdmin: true,
      };

      const user = new User(payload);
      const token = user.generateAuthToken();
      const decoded = jwt.verify(token, process.env.JWT_KEY, {
        expiresIn: process.env.JWT_EXPIRE,
      });
      expect(decoded).toMatchObject(payload);
    });
  });
});

import mongoose from 'mongoose';
import expect from 'expect';
import request from 'supertest';

import server from '../server';
import User from '../models/user';

describe('Integration test for users routes', () => {
  let userOne;
  let userTwo;
  beforeEach(async () => {
    userOne = new User({
      email: 'bilush@gmail.com',
      password: 'userOnePass',
      isAdmin: true,
    });
    await userOne.save();

    userTwo = new User({
      email: 'shola@gmail.com',
      password: 'userTwoPass',
      isAdmin: false,
    });
    await userTwo.save();
  });
  afterEach(async () => {
    await User.deleteMany({});
  });
  describe('GET /user/me', () => {
    it('should return user if authenticated', async () => {
      const token = userOne.generateAuthToken();
      const res = await request(server).get('/user/me').set('auth', token);
      expect(res.status).toBe(200);
    });

    it('should return 401 if user is not authenticated', async () => {
      const res = await request(server).get('/user/me');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /user/signup', () => {
    it('should create a user', async () => {
      const email = 'example@example.com';
      const password = '123mnb!';
      const isAdmin = true;

      const res = await request(server)
        .post('/user/signup')
        .send({ email, password, isAdmin });
      expect(res.status).toBe(201);
      expect(res.body.message).toBeTruthy();

      const user = await User.findOne({ email });
      expect(user).toBeTruthy();
      expect(user).toHaveProperty('_id');
      expect(user.password).not.toBe(password);
    });

    it('should not create user if email is already in use', async () => {
      const { email } = userOne;
      const password = 'userOnePass';
      const isAdmin = true;
      const res = await request(server)
        .post('/user/signup')
        .send({ email, password, isAdmin });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /user/login', () => {
    it('should login user and return token', async () => {
      const token = userOne.generateAuthToken();

      const res = await request(server)
        .post('/user/login')
        .set('auth', token)
        .send({
          email: 'bilush@gmail.com',
          password: 'userOnePass',
          isAdmin: true,
        });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should return 400 for invalid login', async () => {
      const token = userOne.generateAuthToken();

      const res = await request(server)
        .post('/user/login')
        .set('auth', token)
        .send({
          email: 'bilush@gmail.com',
          password: 'userOnePass!',
          isAdmin: true,
        });
      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /user/:userId', () => {
    it('should return 404 if user not found', async () => {
      const token = userOne.generateAuthToken();

      const id = mongoose.Types.ObjectId();
      const res = await request(server)
        .post(`/user/${id}`)
        .set('auth', token)
        .send();
      expect(res.status).toBe(404);
    });
  });
});

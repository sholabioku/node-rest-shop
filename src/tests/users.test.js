import mongoose from 'mongoose';
import expect from 'expect';
import request from 'supertest';

import server from '../server';
import User from '../models/user';

describe('Integration test for users routes', () => {
  let userOne;
  let userTwo;
  const users = [
    {
      email: 'bilush@gmail.com',
      password: 'userOnePass',
      isAdmin: true,
    },
    {
      email: 'shola@gmail.com',
      password: 'userTwoPass',
      isAdmin: false,
    },
  ];

  beforeEach(async () => {
    userOne = new User(users[0]);
    await userOne.save();

    userTwo = new User(users[1]);
    await userTwo.save();
  });
  afterEach(async () => {
    await User.deleteMany({});
  });
  describe('GET /user/me', () => {
    it('should return user if authenticated', async () => {
      const userOneToken = userOne.generateAuthToken();
      const res = await request(server)
        .get('/user/me')
        .set('auth', userOneToken);
      expect(res.status).toBe(200);
      expect(res.body._id).toBe(userOne._id.toHexString());
      expect(res.body.email).toBe(userOne.email);
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

    it('should return 400 if email is already exist', async () => {
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
      const userOneToken = userOne.generateAuthToken();

      const res = await request(server)
        .post('/user/login')
        .set('auth', userOneToken)
        .send(users[0]);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should return 401 for invalid login', async () => {
      const userOneToken = userOne.generateAuthToken();

      const res = await request(server)
        .post('/user/login')
        .set('auth', userOneToken)
        .send({
          email: 'bilush@gmail.com',
          password: 'userOnePass!',
          isAdmin: true,
        });
      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /user/:id', () => {
    it('should return 401 if user is not logged in', async () => {
      const res = await request(server).delete(`/user/${userOne._id}`).send();
      expect(res.status).toBe(401);
    });

    it('should return 404 if user not found', async () => {
      const userOneToken = userOne.generateAuthToken();

      const id = mongoose.Types.ObjectId();
      const res = await request(server)
        .delete(`/user/${id}`)
        .set('auth', userOneToken)
        .send();
      expect(res.status).toBe(404);
    });

    it('should return 200 if user is deleted', async () => {
      const userOneToken = userOne.generateAuthToken();

      const res = await request(server)
        .delete(`/user/${userOne._id}`)
        .set('auth', userOneToken)
        .send();
      expect(res.status).toBe(200);
    });
  });
});

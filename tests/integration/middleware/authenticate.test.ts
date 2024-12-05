import request from 'supertest';
import server from '../../../src/index';
import User from '../../../src/models/user';
import Card, { ICard } from '../../../src/models/card';
import { Password } from '../../../src/services/password';

describe('authenticate', () => {
  const endPoint = '/api/cards';
  let token: string;

  beforeEach(() => {
    const user = new User({ email: 'a@a.com', password: 'a' });
    token = Password.generateJWT({
      _id: user._id,
      email: user.email,
      isAdmin: false,
    });
  });

  afterEach(async () => {
    await Card.collection.deleteMany({});
  });

  afterAll(async () => {
    server.close();
    await User.collection.deleteMany({});
  });

  const apiRequest = async () => {
    return await request(server).get(endPoint).set({ 'x-auth-token': token });
  };

  it('should return 401 if token is not provided', async () => {
    token = '';
    const res = await apiRequest();
    expect(res.status).toBe(401);
  });

  it('should return 400 if token is invalid', async () => {
    token = 'a';
    const res = await apiRequest();
    expect(res.status).toBe(400);
  });

  it('should return 200 if token is valid', async () => {
    const res = await apiRequest();
    expect(res.status).toBe(200);
  });
});

import request from 'supertest';
import server from '../../../src/index';
import User, { IUser } from '../../../src/models/user';
import { Password } from '../../../src/services/password';

describe('checkIsAdmin integration', () => {
  const endPoint = '/api/users';
  let token: string;
  let user: IUser;

  const apiRequest = async () => {
    return request(server).get(endPoint).set({ 'x-auth-token': token });
  };

  beforeEach(() => {
    user = new User({
      email: 'a@a.com',
      password: 'a',
    });

    token = Password.generateJWT({
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  });

  afterAll(async () => {
    server.close();
    await User.collection.deleteMany({});
  });

  it('should return 403 if authUser.isAdmin is falsy', async () => {
    const res = await apiRequest();
    expect(res.status).toBe(403);
  });
});

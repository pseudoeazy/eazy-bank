import request from 'supertest';
import server from '../../../src/index';
import User from '../../../src/models/user';
import Card, { ICard } from '../../../src/models/card';
import { Password } from '../../../src/services/password';
import { generateATMCard } from '../../../src/services/card-generator';

describe('/api/cards', () => {
  const endPoint = '/api/cards';
  const user = new User({ email: 'a@a.com', password: 'a' });
  let token: string;

  beforeEach(() => {
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

  describe('GET /', () => {
    const apiRequest = async () => {
      return await request(server).get(endPoint).set({ 'x-auth-token': token });
    };

    it('should return 401 if user is not logged in', async () => {
      token = '';
      const res = await apiRequest();
      expect(res.status).toBe(401);
    });

    it('should return an array of ATM cards owned by the user', async () => {
      const card = await generateATMCard();
      const savedCard = new Card({ user: user._id, ...card });
      await savedCard.save();

      const res = await apiRequest();

      expect(res.status).toBe(200);
      expect(
        res.body.some((a: ICard) => a.cardNumber === savedCard.cardNumber)
      ).toBeTruthy();
    });
  });

  describe('POST /', () => {
    const apiRequest = async () => {
      return await request(server)
        .post(endPoint)
        .set({ 'x-auth-token': token });
    };

    it('should return 401 if user is not logged in', async () => {
      token = '';
      const res = await apiRequest();
      expect(res.status).toBe(401);
    });

    it('should return a valid ATM card', async () => {
      const res = await apiRequest();

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('cardNumber');
      expect(res.body).toHaveProperty('expiryDate');
      expect(res.body).toHaveProperty('cvv');
      expect(res.body).toHaveProperty('_id');
    });
  });
});

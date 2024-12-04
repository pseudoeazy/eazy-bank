import { Password, TokenPayload } from '../../../src/services/password';
import mongoose from 'mongoose';

describe('Password.generateJWT', () => {
  it('should generate a valid JWT', () => {
    const payload: TokenPayload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      email: 'a',
      isAdmin: false,
    };
    const token = Password.generateJWT(payload);
    const decodedJWT = Password.verifyJWT(token);

    expect(decodedJWT).toMatchObject(payload);
  });
});

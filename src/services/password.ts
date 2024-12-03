import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from 'config';

export interface TokenPayload {
  _id: string;
  email: string;
  isAdmin: boolean;
}

export class Password {
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  static async compare(
    password: string,
    storedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, storedPassword);
  }

  static generateJWT(payload: TokenPayload): string {
    return jwt.sign(payload, config.get('jwtPrivateKey'));
  }

  static verifyJWT(token: string) {
    return jwt.verify(token, config.get('jwtPrivateKey')) as TokenPayload;
  }
}

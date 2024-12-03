import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import config from 'config';

const scryptAsync = promisify(scrypt);

export interface TokenPayload {
  _id: string;
  email: string;
  isAdmin: boolean;
}

export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buf.toString('hex')}.${salt}`;
  }

  static async toCompare(storedPassword: string, suppliedPassword: string) {
    const [hashPassword, salt] = storedPassword.split('.');
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
    return buf.toString('hex') === hashPassword;
  }

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

  static sign(payload: TokenPayload): string {
    return jwt.sign(payload, config.get('jwtPrivateKey'));
  }

  static verify(token: string) {
    return jwt.verify(token, config.get('jwtPrivateKey')) as TokenPayload;
  }
}

import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { Password } from '../../../src/services/password';
import authenticate from '../../../src/middlewares/authenticate';

describe('authenticate', () => {
  it('should populate req.authUser with the payload of a valid JWT', () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      email: 'a@a.com',
      isAdmin: false,
    };
    const token = Password.generateJWT(payload);

    const req = {
      header: jest.fn().mockReturnValue(token),
    } as unknown as Request;
    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    authenticate(req, res, next);

    expect(req.authUser).toBeDefined();
    expect(req.authUser).toMatchObject(payload);
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 if no token is provided', () => {
    const req = {
      header: jest.fn().mockReturnValue(''),
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith('Access Denied. No token provided');
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if token is invalid', () => {
    const req = {
      header: jest.fn().mockReturnValue('invalidToken'),
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('Invalid token provided.');
    expect(next).not.toHaveBeenCalled();
  });
});

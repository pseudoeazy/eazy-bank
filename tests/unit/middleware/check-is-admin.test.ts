import { Request, Response } from 'express';
import checkIsAdmin from '../../../src/middlewares/check-is-admin';

describe('checkIsAdmin', () => {
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  it('should return 403 if authUser.isAdmin is falsy', () => {
    const req = {
      header: jest.fn().mockReturnValue(''),
    } as unknown as Request;

    checkIsAdmin(req, res as Response, next);

    expect(req.authUser?.isAdmin).toBeFalsy();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith('Access denied.');
    expect(next).not.toHaveBeenCalled();
  });

  it('should pass control to the next middle if authUser.isAdmin is true', () => {
    const req = {
      authUser: { isAdmin: true },
    } as unknown as Request;

    checkIsAdmin(req, res as Response, next);

    expect(next).toHaveBeenCalled();
  });
});

import express, { Request, Response } from 'express';
import _ from 'lodash';
import User from '../models/user';
import authenticate from '../middlewares/authenticate';
import admin from '../middlewares/admin';

const router = express.Router();

router.get('/me', authenticate, async (req: Request, res: Response) => {
  const currentUser = await User.findById(req.authUser?._id).select(
    '-password'
  );

  res.send(currentUser);
});

router.get('/', [authenticate, admin], async (req: Request, res: Response) => {
  const users = await User.find().select('-password');
  res.send(users);
});

export { router as userRouter };

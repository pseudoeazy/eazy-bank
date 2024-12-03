import express, { Request, Response } from 'express';
import _ from 'lodash';
import User from '../models/user';
import Account from '../models/account';
import { generateAccountNumber } from '../services/acc-num-generator';
import { Password } from '../services/password';

const router = express.Router();

router.post('/signup', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email && !password)
    res.status(400).send({ message: 'Invalid email or Password' });

  const userExist = await User.findOne({ email });

  if (userExist) {
    return res.status(400).send({ message: 'User already exist' });
  }

  req.body.password = await Password.hashPassword(password);

  let user = new User(_.pick(req.body, ['email', 'password']));
  user = await user.save();

  // Create user account number
  const accountNumber = generateAccountNumber();
  const account = new Account({ accountNumber, user: user._id });
  await account.save();

  res.status(201).send({
    ..._.pick(user, ['_id', 'email', 'created']),
    ..._.pick(account, ['accountNumber', 'balance']),
  });
});

router.post('/signin', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const userExist = await User.findOne({ email });

  if (!userExist) {
    return res.status(401).send({ message: 'Invalid email or password' });
  }

  const passwordMatch = await Password.compare(password, userExist.password);
  if (!passwordMatch) {
    return res.status(401).send({ message: 'Invalid email or password' });
  }

  const userJwt = Password.sign({
    _id: userExist._id,
    email: userExist.email,
    isAdmin: userExist.isAdmin,
  });

  res.status(200).send(userJwt);
});

export { router as authRouter };

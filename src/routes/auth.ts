import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import Account from '../models/account';
import { currentUser } from '../middlewares/current-user';
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

  const hashedPassword = await Password.toHash(password);

  const newUser = new User({ email, password: hashedPassword });
  const user = await newUser.save();

  // Create user account number
  const accountNumber = generateAccountNumber();
  const account = new Account({ accountNumber, user: user._id });
  await account.save();

  res.status(201).send({ user, account });
});

router.post('/signin', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const userExist = await User.findOne({ email });

  if (!userExist) {
    return res.status(401).send({ message: 'Invalid email or password' });
  }

  const passwordMatch = await Password.compare(userExist.password, password);
  if (!passwordMatch) {
    return res.status(401).send({ message: 'Invalid email or password' });
  }

  const userJwt = jwt.sign(
    {
      id: userExist._id,
      email: userExist.email,
    },
    process.env.JWT_KEY!
  );

  req.session = {
    jwt: userJwt,
  };
  res.status(200).send(userJwt);
});

router.post('/signout', async (req: Request, res: Response) => {
  req.session = null;
  res.send({});
});

router.get('/me', currentUser, async (req: Request, res: Response) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as authRouter };

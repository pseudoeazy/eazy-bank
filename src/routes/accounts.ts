import express, { Request, Response } from 'express';
import Account from '../models/account';
import { generateAccountNumber } from '../services/acc-num-generator';
import authenticate from '../middlewares/authenticate';

const router = express.Router();

router.post('/', authenticate, async (req: Request, res: Response) => {
  try {
    const accountNumber = generateAccountNumber();

    const account = new Account({ accountNumber, user: req.authUser });
    await account.save();

    res.status(201).send({ message: 'Account created successfully' });
  } catch (error) {
    res.status(400).send({ message: 'Error creating account' });
    console.error(error);
  }
});

router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const account = Account.findOne({ user: req.authUser?._id });
    if (!account)
      return res.status(400).send({ message: 'Account not found!' });

    res.status(200).send(account);
  } catch (error) {
    res.status(400).send({ message: 'Error creating account' });
    console.error(error);
  }
});

export { router as AccountRouter };

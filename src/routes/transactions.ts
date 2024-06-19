import express, { Request, Response } from 'express';
import moment from 'moment';
import Transaction from '../models/transaction';
import Account from '../models/account';
import { requireAuth } from '../middlewares/require-auth';

const router = express.Router();
const CURRENCY = process.env.CURRENCY || 'USD';

router.post('/deposit', requireAuth, async (req: Request, res: Response) => {
  try {
    const { amount, accountNumber } = req.body;

    const validAccount = await Account.findOne({
      accountNumber,
      user: req.currentUser?._id,
    });

    if (!validAccount) {
      return res.status(400).send({ message: 'Invalid account details' });
    }

    const now = moment();
    const formattedDate = now.format('YYYY-MM-DD');
    const formattedTime = now.format('HH:mm:ss');

    // Format as USD
    const formattedUSD = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: CURRENCY,
    }).format(amount);

    const transaction = new Transaction({
      amount,
      type: 'deposit',
      account: validAccount._id,
      description: `Credit alert of ${formattedUSD} from ${accountNumber} on ${formattedDate} at ${formattedTime} `,
    });
    await transaction.save();

    // Deduct transaction charges here
    validAccount.balance = validAccount.balance + amount;
    await validAccount.save();

    return res.status(200).send({
      message: `Transaction of ${formattedUSD} successful.`,
      account: validAccount,
    });
  } catch (error) {
    res.status(500).send('Error processing transfer');
    console.error(error);
  }
});

router.post('/withdrawal', requireAuth, async (req: Request, res: Response) => {
  try {
    const { amount, accountNumber } = req.body;

    const validAccount = await Account.findOne({
      accountNumber,
      user: req.currentUser?._id,
    });

    if (!validAccount) {
      return res.status(400).send({ message: 'Invalid account details' });
    }

    const isInSufficientBalance = validAccount.balance < amount;

    if (isInSufficientBalance) {
      return res.status(400).send({ message: 'Insufficient balance' });
    }

    const now = moment();
    const formattedDate = now.format('YYYY-MM-DD');
    const formattedTime = now.format('HH:mm:ss');

    // Format as USD
    const formattedUSD = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: CURRENCY,
    }).format(amount);

    const transaction = new Transaction({
      amount,
      type: 'withdrawal',
      account: validAccount._id,
      description: `Debit alert of ${formattedUSD} from ${accountNumber} on ${formattedDate} at ${formattedTime} `,
    });
    await transaction.save();

    // Deduct amount, transaction charges here
    validAccount.balance = validAccount.balance - amount;
    await validAccount.save();

    return res.status(200).send({
      message: `Transaction of ${formattedUSD} successful.`,
      account: validAccount,
    });
  } catch (error) {
    res.status(500).send('Error processing transfer');
    console.error(error);
  }
});

router.post('/p2p', requireAuth, async (req: Request, res: Response) => {
  try {
    const { fromAccountNumber, toAccountNumber, amount } = req.body;

    if (typeof amount !== 'number' || amount <= 0) {
      res.status(400).send({ message: 'Amount must be greater than 0' });
    }

    const fromAccount = await Account.findOne({
      accountNumber: fromAccountNumber,
      user: req.currentUser!._id,
    });

    const toAccount = await Account.findOne({
      accountNumber: toAccountNumber,
    });

    if (!fromAccount || !toAccount) {
      return res.status(400).send({ message: 'Invalid account details' });
    }

    const isInSufficientBalance = fromAccount.balance < amount;

    if (isInSufficientBalance) {
      return res.status(400).send({ message: 'Insufficient balance' });
    }

    const now = moment();
    const formattedDate = now.format('YYYY-MM-DD');
    const formattedTime = now.format('HH:mm:ss');

    // Format as USD
    const formattedUSD = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: CURRENCY,
    }).format(amount);

    // Initiate Sender Transaction
    const senderTransaction = new Transaction({
      amount,
      type: 'withdrawal',
      account: fromAccount._id,
      description: `Debit of ${formattedUSD} from ${fromAccountNumber} to ${toAccountNumber} on ${formattedDate} at ${formattedTime} `,
    });

    // Initiate Recipient Transaction
    const recipientTransaction = new Transaction({
      amount,
      type: 'deposit',
      account: toAccount._id,
      description: `Credit of ${formattedUSD} from ${fromAccountNumber} to ${toAccountNumber} on ${formattedDate} at ${formattedTime} `,
    });

    await senderTransaction.save();
    await recipientTransaction.save();

    // Deduct amount, transaction charges here
    fromAccount.balance = fromAccount.balance - amount;
    toAccount.balance = toAccount.balance + amount;

    await fromAccount.save();
    await toAccount.save();

    return res.status(200).send({
      message: `Transaction of ${formattedUSD} successful.`,
      account: fromAccount,
    });
  } catch (error) {
    res.status(500).send('Error processing transfer');
    console.error(error);
  }
});

router.get('/account', requireAuth, async (req: Request, res: Response) => {
  try {
    const { accountNumber } = req.body;

    const account = await Account.findOne({ accountNumber });
    if (!account) {
      return res.status(400).send({ message: 'Account not found' });
    }

    const transactions = await Transaction.find({
      account: account._id,
    })
      .populate('account')
      .sort({ created: -1 });

    return res.status(200).send({ transactions });
  } catch (error) {
    res.status(400).send({ message: 'Error retrieving transactions' });
    console.error('Error retrieving transactions:', error);
  }
});
export { router as transactionRouter };

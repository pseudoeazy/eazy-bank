import express, { Request, Response } from 'express';
import authenticate from '../middlewares/authenticate';
import { generateATMCard } from '../services/card-generator';
import Card from '../models/card';

const router = express.Router();

// Create new ATM Card
router.post('/', authenticate, async (req: Request, res: Response) => {
  const { cardNumber, cvv, expiryDate } = await generateATMCard();

  const card = new Card({
    cardNumber,
    cvv,
    expiryDate,
    user: req.authUser?._id,
  });
  const newCard = await card.save();

  res.status(201).send(newCard);
});

// Get current user ATM Cards
router.get('/', authenticate, async (req: Request, res: Response) => {
  const cards = await Card.find({ user: req.authUser?._id });
  res.status(200).send(cards);
});

export { router as cardsRouter };

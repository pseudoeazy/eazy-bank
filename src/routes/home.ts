import express, { Request, Response } from 'express';
import config from 'config';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.status(200).send(config.get('name'));
});

export { router as homeRouter };

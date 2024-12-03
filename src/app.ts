import express, { Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import debug from 'debug';

import 'express-async-errors';
import errorHandler from './middlewares/error-handler';
import { authRouter } from './routes/auth';
import { homeRouter } from './routes/home';
import { cardsRouter } from './routes/cards';
import { transactionRouter } from './routes/transactions';
import { AccountRouter } from './routes/accounts';
import { userRouter } from './routes/users';

const app = express();

// middlewares
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  const startupDebugger = debug('app:startup');
  startupDebugger('Morgan enabled');
}

//api routes
app.use('/api', homeRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/accounts', AccountRouter);
app.use('/api/cards', cardsRouter);
app.use('/api/transactions', transactionRouter);

// Example async route
async function someAsyncFunction() {
  throw new Error('Simulated error!');
}

app.get('/api/async-route', async (req: Request, res: Response) => {
  const result = await someAsyncFunction(); // Errors will be caught by express-async-errors
  res.json({ data: result });
});

// Error-handling middleware
app.use(errorHandler);

app.get('*', async (req, res) => {
  res.status(404).send({ message: 'Route Not found!' });
});

export default app;

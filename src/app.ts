import express from 'express';
import cookieSession from 'cookie-session';
import 'express-async-errors';
import { authRouter } from './routes/auth';
import { currentUser } from './middlewares/current-user';
import { cardsRouter } from './routes/cards';
import { transactionRouter } from './routes/transactions';
import { AccountRouter } from './routes/accounts';

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);
app.use(currentUser);

//api routes
app.use('/api/auth', authRouter);
app.use('/api/accounts', AccountRouter);
app.use('/api/cards', cardsRouter);
app.use('/api/transactions', transactionRouter);

app.get('*', async () => {
  throw new Error('Route Not found!');
});

export default app;

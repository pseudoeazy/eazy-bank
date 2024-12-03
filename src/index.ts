import dotenv from 'dotenv';
dotenv.config();
import config from 'config';
import mongoose from 'mongoose';
import debug from 'debug';
import app from './app';

const start = async () => {
  if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined!');
    process.exit(1);
  }
  console.log(`Name: ${config.get('name')}`);
  console.log('jwtPrivateKey: ', config.get('jwtPrivateKey'));

  const dbDebugger = debug('app:db');
  dbDebugger('Connected to Database!');

  mongoose
    .connect(config.get('mongoDB'))
    .then(() => console.log('Connected to Mongo DB'))
    .catch((err) => console.log('Could not connect to Mongo DB ', err));

  const PORT = process.env.PORT || 4000;

  return app.listen(PORT, () => {
    console.log(`Node.js Bank Application running on port ${PORT}`);
  });
};

start();

export default start;

import mongoose from 'mongoose';
import config from 'config';
import logger from './logger';

function db() {
  const mongoDBUri: string =
    process.env.NODE_ENV === 'test'
      ? process.env.MONGO_DB_TEST!
      : config.get('mongoDB');
  mongoose
    .connect(mongoDBUri)
    .then(() => logger.info(`Connected to Mongo DB ${mongoDBUri}`));
}

export default db;

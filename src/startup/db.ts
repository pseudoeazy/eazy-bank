import mongoose from 'mongoose';
import config from 'config';
import logger from './logger';

function db() {
  const mongoDB = config.get('mongoDB') as string;
  mongoose
    .connect(mongoDB)
    .then(() => logger.info(`Connected to Mongo DB ${mongoDB}`));
}

export default db;

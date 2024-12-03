import mongoose from 'mongoose';
import config from 'config';
import logger from './logger';

function db() {
  mongoose
    .connect(config.get('mongoDB'))
    .then(() => logger.info('Connected to Mongo DB'));
}

export default db;

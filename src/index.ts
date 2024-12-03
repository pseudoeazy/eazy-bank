import dotenv from 'dotenv';
dotenv.config();
import config from 'config';
import mongoose from 'mongoose';
import logger, { uncaughtLogger } from './middlewares/logger';
import app from './app';

const start = async () => {
  if (!config.get('jwtPrivateKey')) {
    logger.error('FATAL ERROR: jwtPrivateKey is not defined!');
    process.exit(1);
  }

  uncaughtLogger();
  mongoose
    .connect(config.get('mongoDB'))
    .then(() => logger.info('Connected to Mongo DB'))
    .catch((err) => logger.log('error', 'Could not connect to Mongo DB ', err));

  const PORT = process.env.PORT || 4000;

  return app.listen(PORT, () => {
    logger.info(`${config.get('name')} running on port ${PORT}`);
  });
};

start();

export default start;

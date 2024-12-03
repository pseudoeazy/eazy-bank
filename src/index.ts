import dotenv from 'dotenv';
dotenv.config();
import config from 'config';
import db from './startup/db';
import logger, { uncaughtLogger } from './startup/logger';
import appConfig from './startup/app-config';
import app from './app';

const start = async () => {
  appConfig();
  uncaughtLogger();
  db();

  const PORT = process.env.PORT || 4000;
  return app.listen(PORT, () => {
    logger.info(`${config.get('name')} running on port ${PORT}`);
  });
};

start();

export default start;

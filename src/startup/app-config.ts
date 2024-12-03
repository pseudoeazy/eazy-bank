import config from 'config';
import logger from './logger';

function appConfig() {
  if (!config.get('jwtPrivateKey')) {
    logger.error('FATAL ERROR: jwtPrivateKey is not defined!');
    process.exit(1);
  }
}

export default appConfig;

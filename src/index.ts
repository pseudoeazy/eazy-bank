import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app';

const start = async () => {
  dotenv.config();

  mongoose
    .connect(process.env.MONGO_DB!)
    .then(() => console.log('Connected to Mongo DB'))
    .catch((err) => console.log('Could not connect to Mongo DB ', err));

  const PORT = process.env.PORT || 4000;

  return app.listen(PORT, () => {
    console.log(`Node.js Bank Application running on port ${PORT}`);
  });
};

start();

export default start;

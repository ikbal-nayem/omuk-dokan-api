import dotenv from 'dotenv';
import mongoose, { ConnectOptions } from 'mongoose';

dotenv.config();

const { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER } = process.env;

const connectToDatabase = async (): Promise<void> => {
  const options: ConnectOptions = {};

  await mongoose.connect(`mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`, options);

  console.log('Connected to MongoDB');
};

export { connectToDatabase };

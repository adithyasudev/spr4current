import mongoose from 'mongoose';
import { log } from './logger.js';
import { config } from 'dotenv';

config();
const MONGO_URI = process.env.DB_URL;

mongoose.connect(MONGO_URI).then(() => {
  log('info', 'MongoDB connected successfully.');
}).catch(err => {
  log('error', `MongoDB connection error: ${err}`);
});

const entrySchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: String,
  score: Number,
  age: Number,
  city: String,
  gender: String
}, { timestamps: true });

export const Entry = mongoose.model('Entry', entrySchema);

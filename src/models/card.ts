import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user';

export interface ICard extends Document {
  _id: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  user: mongoose.Types.ObjectId;
  created: Date;
}

const cardSchema = new Schema<ICard>({
  cardNumber: { type: String, required: true, unique: true },
  expiryDate: { type: String, required: true },
  cvv: { type: String, required: true },
  created: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Card = mongoose.model<ICard>('Card', cardSchema);

export default Card;

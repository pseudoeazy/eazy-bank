import mongoose, { Schema, Document, model } from 'mongoose';

export interface ITransaction extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  amount: number;
  type: 'deposit' | 'withdrawal';
  account: mongoose.Types.ObjectId;
  description: string;
  created: Date;
}

const transactionSchema = new Schema({
  amount: { type: Number, required: true },
  type: { type: String, enum: ['deposit', 'withdrawal'], required: true },
  description: { type: String },
  created: { type: Date, default: Date.now },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
});

const Transaction = model<ITransaction>('Transaction', transactionSchema);

export default Transaction;

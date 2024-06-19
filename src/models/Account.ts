import mongoose, { Document, Schema } from 'mongoose';

interface IAccount extends Document {
  accountNumber: string;
  balance: number;
  user: mongoose.Types.ObjectId;
}

const accountSchema: Schema<IAccount> = new mongoose.Schema({
  accountNumber: { type: String, required: true, unique: true },
  balance: { type: Number, required: true, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Account = mongoose.model<IAccount>('Account', accountSchema);
export default Account;

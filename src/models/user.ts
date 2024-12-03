import { Schema, Document, model } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  isAdmin: boolean;
  created: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },
});

const User = model<IUser>('User', userSchema);

export default User;

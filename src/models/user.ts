import { Schema, Document, model } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  created: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created: { type: Date, default: Date.now },
});

const User = model<IUser>('User', userSchema);

export default User;

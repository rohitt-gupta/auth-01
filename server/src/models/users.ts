import mongoose, { Document, Schema } from "mongoose";
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  googleId: string;
  name: string;
  email: string;
  password?: string;
  gender?: string;
  age?: number;
  dob?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema: Schema = new Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },

  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  gender: String,
  age: Number,
  dob: Date
}, {
  timestamps: true
});

userSchema.pre('save', async function (this: IUser, next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password!, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.comparePassword = async function (this: IUser, candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password!);
  } catch (error) {
    throw error;
  }
};

export default mongoose.model<IUser>("User", userSchema);

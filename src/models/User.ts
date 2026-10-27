import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  level: number;
  xp: number;
  currentStreak: number;
  longestStreak: number;
  lastLogin: Date;
  careerPath?: string; // AI generated path e.g., 'Full-Stack Developer'
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastLogin: { type: Date, default: Date.now },
  careerPath: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

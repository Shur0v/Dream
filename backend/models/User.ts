/**
 * User MongoDB Model
 */

import mongoose, { Schema, Document } from 'mongoose';
import { User, UserRole } from '@/types';

export interface UserDocument extends Omit<User, 'id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const AddressSchema = new Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
}, { _id: false });

const UserSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true, index: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: false, default: '' },
    role: { type: String, enum: ['client', 'seller', 'reseller', 'super-admin'], default: 'client', index: true },
    avatar: { type: String },
    phone: { type: String },
    address: { type: AddressSchema },
    isEmailVerified: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    toJSON: {
      transform: function (doc: any, ret: any) {
        ret.id = ret._id?.toString() || ret.id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

const UserModel = mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema);

export default UserModel;


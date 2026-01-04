/**
 * Promo Banner MongoDB Model
 */

import mongoose, { Schema, Document } from 'mongoose';
import { PromoBanner, PromoBannerVariant } from '@/types';

export interface PromoBannerDocument extends Omit<PromoBanner, 'id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const CountdownSchema = new Schema({
  days: { type: Number, default: 0, min: 0 },
  hours: { type: Number, default: 0, min: 0, max: 23 },
  minutes: { type: Number, default: 0, min: 0, max: 59 },
  seconds: { type: Number, default: 0, min: 0, max: 59 },
}, { _id: false });

const PromoBannerSchema = new Schema<PromoBannerDocument>(
  {
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    description: { type: String },
    startingBidLabel: { type: String },
    priceText: { type: String },
    image: { type: String, required: true },
    backgroundImage: { type: String },
    ctaLabel: { type: String },
    ctaLink: { type: String },
    initialTime: { type: CountdownSchema, default: { days: 0, hours: 0, minutes: 0, seconds: 0 } },
    variant: { type: String, enum: ['slider', 'card'], default: 'slider' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
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
PromoBannerSchema.index({ isActive: 1, order: 1 });

const PromoBannerModel = mongoose.models.PromoBanner || mongoose.model<PromoBannerDocument>('PromoBanner', PromoBannerSchema);

export default PromoBannerModel;


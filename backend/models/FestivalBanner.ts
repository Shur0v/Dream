/**
 * Festival Banner MongoDB Model
 */

import mongoose, { Schema, Document } from 'mongoose';
import { FestivalBanner } from '@/types';

export interface FestivalBannerDocument extends Omit<FestivalBanner, 'id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const CouponSchema = new Schema({
  code: { type: String, required: true },
  amount: { type: String, required: true },
}, { _id: false });

const FestivalBannerSchema = new Schema<FestivalBannerDocument>(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    discount: { type: String, required: true },
    emi: { type: String, required: true },
    image: { type: String, required: true },
    coupons: [CouponSchema],
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
FestivalBannerSchema.index({ isActive: 1, order: 1 });

const FestivalBannerModel = mongoose.models.FestivalBanner || mongoose.model<FestivalBannerDocument>('FestivalBanner', FestivalBannerSchema);

export default FestivalBannerModel;


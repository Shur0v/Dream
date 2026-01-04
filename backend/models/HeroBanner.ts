/**
 * Hero Banner MongoDB Model
 */

import mongoose, { Schema, Document } from 'mongoose';
import { HeroBanner } from '@/types';

export interface HeroBannerDocument extends Omit<HeroBanner, 'id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const HeroBannerSchema = new Schema<HeroBannerDocument>(
  {
    sliderImages: [{ type: String }],
    rightBanners: [{ type: String }],
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
HeroBannerSchema.index({ isActive: 1 });

const HeroBannerModel = mongoose.models.HeroBanner || mongoose.model<HeroBannerDocument>('HeroBanner', HeroBannerSchema);

export default HeroBannerModel;


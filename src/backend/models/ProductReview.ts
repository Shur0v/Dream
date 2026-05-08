/**
 * Product Review MongoDB Model
 */

import mongoose, { Schema, Document } from 'mongoose';
import { ProductReview, ReviewSource } from '@/types';

export interface ProductReviewDocument extends Omit<ProductReview, 'id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const ProductReviewSchema = new Schema<ProductReviewDocument>(
  {
    productId: { type: String, required: true, index: true },
    productName: { type: String },
    author: { type: String, required: true, default: 'Anonymous' },
    rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    comment: { type: String, default: '' },
    date: { type: String },
    verified: { type: Boolean, default: false },
    source: { type: String, enum: ['admin', 'user', 'imported'], default: 'admin' },
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
// Note: productId already has index: true in schema field above
ProductReviewSchema.index({ createdAt: -1 });

const ProductReviewModel = mongoose.models.ProductReview || mongoose.model<ProductReviewDocument>('ProductReview', ProductReviewSchema);

export default ProductReviewModel;


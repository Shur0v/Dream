/**
 * Best Selling Product MongoDB Model
 */

import mongoose, { Schema, Document } from 'mongoose';
import { BestSellingProduct } from '@/types';

export interface BestSellingProductDocument extends Omit<BestSellingProduct, 'id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const BestSellingProductSchema = new Schema<BestSellingProductDocument>(
  {
    productId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    discount: { type: Number, min: 0, max: 100 },
    images: [{ type: String }],
    category: { type: String, required: true },
    categoryId: { type: String },
    subcategory: { type: String },
    brand: { type: String, required: true },
    sku: { type: String, required: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    colors: [{ type: String }],
    size: [{ type: String }],
    isActive: { type: Boolean, default: true, index: true },
    tags: [{ type: String }],
    specifications: { type: Schema.Types.Mixed, default: {} },
    sellerId: { type: String, required: true },
    bestSellingAt: { type: String, required: true },
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
// Note: productId and isActive already have index: true in schema fields above
BestSellingProductSchema.index({ productId: 1, isActive: 1 }); // Compound index (both fields already indexed, but compound is useful)

const BestSellingProductModel = mongoose.models.BestSellingProduct || mongoose.model<BestSellingProductDocument>('BestSellingProduct', BestSellingProductSchema);

export default BestSellingProductModel;


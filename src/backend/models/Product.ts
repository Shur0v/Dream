/**
 * Product MongoDB Model
 */

import mongoose, { Schema, Document } from 'mongoose';
import { Product } from '@/types';

export interface ProductDocument extends Omit<Product, 'id'>, Document {
  _id: mongoose.Types.ObjectId;
  id?: string; // Optional custom id field
}

const ProductSchema = new Schema<ProductDocument>(
  {
    id: { type: String, index: true }, // Store the custom id field (e.g., "product-1763585972720")
    name: { type: String, required: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    discount: { type: Number, min: 0, max: 100 },
    images: [{ type: String }],
    category: { type: String, required: true, index: true },
    categoryId: { type: String, index: true },
    subcategory: { type: String },
    brand: { type: String, required: true },
    sku: { type: String, required: true, unique: true, index: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    colors: [{ type: String }],
    size: [{ type: String }],
    isActive: { type: Boolean, default: true, index: true },
    tags: [{ type: String }],
    specifications: { type: Schema.Types.Mixed, default: {} },
    sellerId: { type: String, required: true },
    slug: { type: String, index: true },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    toJSON: {
      transform: function (doc: any, ret: any) {
        // Prioritize stored id field, fallback to _id if not present
        ret.id = ret.id || ret._id?.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for performance
// Note: slug and isActive already have index: true in schema fields above
ProductSchema.index({ categoryId: 1, isActive: 1 }); // Compound index (isActive already indexed, but compound is useful)
ProductSchema.index({ brand: 1 });
ProductSchema.index({ createdAt: -1 });

// Check if model already exists to prevent overwrite error in Next.js hot reload
const ProductModel = mongoose.models.Product || mongoose.model<ProductDocument>('Product', ProductSchema);

export default ProductModel;


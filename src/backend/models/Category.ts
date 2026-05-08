/**
 * Category MongoDB Model
 */

import mongoose, { Schema, Document } from 'mongoose';
import { Category } from '@/types';

export interface CategoryDocument extends Omit<Category, 'id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const CategorySchema = new Schema<CategoryDocument>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String },
    image: { type: String },
    parentId: { type: String },
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
CategorySchema.index({ slug: 1, isActive: 1 });
CategorySchema.index({ parentId: 1 });

const CategoryModel = mongoose.models.Category || mongoose.model<CategoryDocument>('Category', CategorySchema);

export default CategoryModel;


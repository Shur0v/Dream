/**
 * Color MongoDB Model
 */

import mongoose, { Schema, Document } from 'mongoose';
import { Color } from '@/types';

export interface ColorDocument extends Omit<Color, 'id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const ColorSchema = new Schema<ColorDocument>(
  {
    name: { type: String, required: true },
    hexCode: { type: String, required: true, match: /^#([0-9a-f]{6})$/i },
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

// Note: isActive already has index: true in schema field above
// No need to duplicate index here

const ColorModel = mongoose.models.Color || mongoose.model<ColorDocument>('Color', ColorSchema);

export default ColorModel;


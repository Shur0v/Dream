/**
 * Order MongoDB Model
 */

import mongoose, { Schema, Document } from 'mongoose';
import { Order, OrderStatus } from '@/types';

export interface OrderDocument extends Omit<Order, 'id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const AddressSchema = new Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
}, { _id: false });

const OrderItemSchema = new Schema({
  id: { type: String, required: true },
  productId: { type: String, required: true },
  product: { type: Schema.Types.Mixed },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  color: { type: String },
  size: { type: String },
}, { _id: false });

const OrderSchema = new Schema<OrderDocument>(
  {
    userId: { type: String, required: true, index: true },
    items: [OrderItemSchema],
    status: { type: String, enum: ['pending', 'confirmed', 'approved', 'rejected', 'shipped', 'delivered', 'cancelled', 'refunded'], default: 'pending', index: true },
    totalAmount: { type: Number, required: true, min: 0 },
    shippingAddress: { type: AddressSchema, required: true },
    billingAddress: { type: AddressSchema },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    trackingNumber: { type: String },
    notes: { type: String },
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
OrderSchema.index({ userId: 1, status: 1 });
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ createdAt: -1 });

const OrderModel = mongoose.models.Order || mongoose.model<OrderDocument>('Order', OrderSchema);

export default OrderModel;


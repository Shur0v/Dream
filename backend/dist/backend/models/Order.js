"use strict";
/**
 * Order MongoDB Model
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const AddressSchema = new mongoose_1.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
}, { _id: false });
const OrderItemSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    productId: { type: String, required: true },
    product: { type: mongoose_1.Schema.Types.Mixed },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    color: { type: String },
    size: { type: String },
}, { _id: false });
const OrderSchema = new mongoose_1.Schema({
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
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id?.toString() || ret.id;
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
// Indexes for performance
OrderSchema.index({ userId: 1, status: 1 });
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ createdAt: -1 });
const OrderModel = mongoose_1.default.models.Order || mongoose_1.default.model('Order', OrderSchema);
exports.default = OrderModel;

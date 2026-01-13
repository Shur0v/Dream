"use strict";
/**
 * Product MongoDB Model
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
const ProductSchema = new mongoose_1.Schema({
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
    specifications: { type: mongoose_1.Schema.Types.Mixed, default: {} },
    sellerId: { type: String, required: true },
    slug: { type: String, index: true },
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    toJSON: {
        transform: function (doc, ret) {
            // Prioritize stored id field, fallback to _id if not present
            ret.id = ret.id || ret._id?.toString();
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
// Indexes for performance
// Note: slug and isActive already have index: true in schema fields above
ProductSchema.index({ categoryId: 1, isActive: 1 }); // Compound index (isActive already indexed, but compound is useful)
ProductSchema.index({ brand: 1 });
ProductSchema.index({ createdAt: -1 });
// Check if model already exists to prevent overwrite error in Next.js hot reload
const ProductModel = mongoose_1.default.models.Product || mongoose_1.default.model('Product', ProductSchema);
exports.default = ProductModel;

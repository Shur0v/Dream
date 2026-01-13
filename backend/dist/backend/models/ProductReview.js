"use strict";
/**
 * Product Review MongoDB Model
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
const ProductReviewSchema = new mongoose_1.Schema({
    productId: { type: String, required: true, index: true },
    productName: { type: String },
    author: { type: String, required: true, default: 'Anonymous' },
    rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    comment: { type: String, default: '' },
    date: { type: String },
    verified: { type: Boolean, default: false },
    source: { type: String, enum: ['admin', 'user', 'imported'], default: 'admin' },
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
// Note: productId already has index: true in schema field above
ProductReviewSchema.index({ createdAt: -1 });
const ProductReviewModel = mongoose_1.default.models.ProductReview || mongoose_1.default.model('ProductReview', ProductReviewSchema);
exports.default = ProductReviewModel;

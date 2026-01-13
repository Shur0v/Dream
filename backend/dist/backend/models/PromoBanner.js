"use strict";
/**
 * Promo Banner MongoDB Model
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
const CountdownSchema = new mongoose_1.Schema({
    days: { type: Number, default: 0, min: 0 },
    hours: { type: Number, default: 0, min: 0, max: 23 },
    minutes: { type: Number, default: 0, min: 0, max: 59 },
    seconds: { type: Number, default: 0, min: 0, max: 59 },
}, { _id: false });
const PromoBannerSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    description: { type: String },
    startingBidLabel: { type: String },
    priceText: { type: String },
    image: { type: String, required: true },
    backgroundImage: { type: String },
    ctaLabel: { type: String },
    ctaLink: { type: String },
    initialTime: { type: CountdownSchema, default: { days: 0, hours: 0, minutes: 0, seconds: 0 } },
    variant: { type: String, enum: ['slider', 'card'], default: 'slider' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
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
PromoBannerSchema.index({ isActive: 1, order: 1 });
const PromoBannerModel = mongoose_1.default.models.PromoBanner || mongoose_1.default.model('PromoBanner', PromoBannerSchema);
exports.default = PromoBannerModel;

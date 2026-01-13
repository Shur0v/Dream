"use strict";
/**
 * @fileoverview Zod schema guards for the JSON database payloads.
 * Ensures SSR/edge handlers never receive malformed objects before they
 * hydrate the UI. Each entity schema is intentionally permissive (passthrough)
 * so we can evolve the shape without failing existing data.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseSchema = void 0;
const zod_1 = require("zod");
const TimestampSchema = zod_1.z
    .string()
    .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: 'Invalid ISO timestamp',
})
    .or(zod_1.z.literal(''))
    .default(() => new Date().toISOString());
const CountdownSchema = zod_1.z.object({
    days: zod_1.z.number().int().nonnegative().default(0),
    hours: zod_1.z.number().int().min(0).max(23).default(0),
    minutes: zod_1.z.number().int().min(0).max(59).default(0),
    seconds: zod_1.z.number().int().min(0).max(59).default(0),
});
const ColorSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
    name: zod_1.z.string().min(1),
    hexCode: zod_1.z
        .string()
        .regex(/^#([0-9a-f]{6})$/i, 'Invalid HEX color')
        .default('#000000'),
    isActive: zod_1.z.boolean().default(true),
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
});
const CategorySchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
    name: zod_1.z.string().min(1),
    slug: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    image: zod_1.z.string().optional(),
    parentId: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().default(true),
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
});
const ProductSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().default(''),
    price: zod_1.z.preprocess((val) => (typeof val === 'string' ? Number(val) : val), zod_1.z.number()).default(0),
    originalPrice: zod_1.z.number().optional(),
    discount: zod_1.z.number().optional(),
    images: zod_1.z.array(zod_1.z.string()).default([]),
    category: zod_1.z.string(),
    categoryId: zod_1.z.string().optional(),
    subcategory: zod_1.z.string().optional(),
    brand: zod_1.z.string().default(''),
    sku: zod_1.z.string().default(''),
    stock: zod_1.z.number().int().nonnegative().default(0),
    colors: zod_1.z.array(zod_1.z.string()).optional(),
    colorOptions: zod_1.z.array(ColorSchema).optional(),
    size: zod_1.z.array(zod_1.z.string()).optional(),
    isActive: zod_1.z.boolean().default(true),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
    specifications: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional(),
    sellerId: zod_1.z.string().min(1),
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
});
const FeaturedProductSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
    productId: zod_1.z.string().min(1), // Reference to original product
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().default(''),
    price: zod_1.z.preprocess((val) => (typeof val === 'string' ? Number(val) : val), zod_1.z.number()).default(0),
    originalPrice: zod_1.z.number().optional(),
    discount: zod_1.z.number().optional(),
    images: zod_1.z.array(zod_1.z.string()).default([]),
    category: zod_1.z.string(),
    categoryId: zod_1.z.string().optional(),
    subcategory: zod_1.z.string().optional(),
    brand: zod_1.z.string().default(''),
    sku: zod_1.z.string().default(''),
    stock: zod_1.z.number().int().nonnegative().default(0),
    colors: zod_1.z.array(zod_1.z.string()).optional(),
    colorOptions: zod_1.z.array(ColorSchema).optional(),
    size: zod_1.z.array(zod_1.z.string()).optional(),
    isActive: zod_1.z.boolean().default(true),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
    specifications: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional(),
    sellerId: zod_1.z.string().min(1),
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
    featuredAt: TimestampSchema, // When it was marked as featured
});
const BestSellingProductSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
    productId: zod_1.z.string().min(1), // Reference to original product
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().default(''),
    price: zod_1.z.preprocess((val) => (typeof val === 'string' ? Number(val) : val), zod_1.z.number()).default(0),
    originalPrice: zod_1.z.number().optional(),
    discount: zod_1.z.number().optional(),
    images: zod_1.z.array(zod_1.z.string()).default([]),
    category: zod_1.z.string(),
    categoryId: zod_1.z.string().optional(),
    subcategory: zod_1.z.string().optional(),
    brand: zod_1.z.string().default(''),
    sku: zod_1.z.string().default(''),
    stock: zod_1.z.number().int().nonnegative().default(0),
    colors: zod_1.z.array(zod_1.z.string()).optional(),
    colorOptions: zod_1.z.array(ColorSchema).optional(),
    size: zod_1.z.array(zod_1.z.string()).optional(),
    isActive: zod_1.z.boolean().default(true),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
    specifications: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional(),
    sellerId: zod_1.z.string().min(1),
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
    bestSellingAt: TimestampSchema, // When it was marked as best selling
});
const HeroBannerSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
    sliderImages: zod_1.z.array(zod_1.z.string()).default([]), // Main slider images (left side)
    rightBanners: zod_1.z.array(zod_1.z.string()).default([]), // Right side banners: [0] = header/top image, [1] = first bottom, [2] = second bottom (max 3)
    isActive: zod_1.z.boolean().default(true),
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
});
const PromoBannerSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
    title: zod_1.z.string().min(1),
    subtitle: zod_1.z.string().default(''),
    description: zod_1.z.string().optional(),
    startingBidLabel: zod_1.z.string().optional(),
    priceText: zod_1.z.string().optional(),
    image: zod_1.z.string().min(1),
    backgroundImage: zod_1.z.string().optional(),
    ctaLabel: zod_1.z.string().optional(),
    ctaLink: zod_1.z.string().optional(),
    initialTime: CountdownSchema.default({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    }),
    variant: zod_1.z.enum(['slider', 'card']).default('slider'),
    order: zod_1.z.number().int().nonnegative().default(0),
    isActive: zod_1.z.boolean().default(true),
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
});
const FestivalCouponSchema = zod_1.z.object({
    code: zod_1.z.string().min(1),
    amount: zod_1.z.string().min(1),
});
const FestivalBannerSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
    title: zod_1.z.string().min(1),
    subtitle: zod_1.z.string().default(''),
    discount: zod_1.z.string().min(1),
    emi: zod_1.z.string().min(1),
    image: zod_1.z.string().min(1),
    coupons: zod_1.z.array(FestivalCouponSchema).default([]),
    order: zod_1.z.number().int().nonnegative().default(0),
    isActive: zod_1.z.boolean().default(true),
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
});
const ReviewSourceSchema = zod_1.z.enum(['admin', 'user', 'imported']);
const ProductReviewSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
    productId: zod_1.z.string().min(1),
    productName: zod_1.z.string().optional(),
    author: zod_1.z.string().min(1),
    rating: zod_1.z.number().min(1).max(5).default(5),
    comment: zod_1.z.string().min(1),
    date: TimestampSchema,
    verified: zod_1.z.boolean().default(false),
    source: ReviewSourceSchema.default('admin'),
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
});
const MinimalProductSnapshotSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string().default(''),
    price: zod_1.z.number().default(0),
    category: zod_1.z.string().optional(),
    sellerId: zod_1.z.string().optional(),
    // Keep it open-ended so older snapshots still pass
}).passthrough();
const OrderItemSchema = zod_1.z.object({
    id: zod_1.z.string(),
    productId: zod_1.z.string(),
    product: MinimalProductSnapshotSchema.optional(),
    quantity: zod_1.z.number().int().nonnegative().default(1),
    price: zod_1.z.number().nonnegative().default(0),
    color: zod_1.z.string().optional(),
    size: zod_1.z.string().optional(),
});
const AddressSchema = zod_1.z.object({
    street: zod_1.z.string().default(''),
    city: zod_1.z.string().default(''),
    state: zod_1.z.string().default(''),
    zipCode: zod_1.z.string().default(''),
    country: zod_1.z.string().default(''),
});
const OrderStatusSchema = zod_1.z.enum([
    'pending',
    'confirmed',
    'approved',
    'rejected',
    'shipped',
    'delivered',
    'cancelled',
    'refunded',
]);
const PaymentStatusSchema = zod_1.z.enum(['pending', 'paid', 'failed', 'refunded']);
const OrderSchema = zod_1.z.object({
    id: zod_1.z.string(),
    userId: zod_1.z.string(),
    items: zod_1.z.array(OrderItemSchema).default([]),
    status: OrderStatusSchema.default('pending'),
    totalAmount: zod_1.z.number().nonnegative().default(0),
    shippingAddress: AddressSchema,
    billingAddress: AddressSchema.optional(),
    paymentMethod: zod_1.z.string().default(''),
    paymentStatus: PaymentStatusSchema.default('pending'),
    trackingNumber: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
});
const UserRoleSchema = zod_1.z.enum(['client', 'seller', 'reseller', 'super-admin']);
const UserSchema = zod_1.z.object({
    id: zod_1.z.string(),
    email: zod_1.z.string().email(),
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
    role: UserRoleSchema.default('client'),
    avatar: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
    address: AddressSchema.optional(),
    isEmailVerified: zod_1.z.boolean().default(false),
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
});
exports.DatabaseSchema = zod_1.z.object({
    products: zod_1.z.array(ProductSchema).default([]),
    orders: zod_1.z.array(OrderSchema).default([]),
    categories: zod_1.z.array(CategorySchema).default([]),
    colors: zod_1.z.array(ColorSchema).default([]),
    users: zod_1.z.array(UserSchema).default([]),
    featuredProducts: zod_1.z.array(FeaturedProductSchema).default([]),
    bestSellingProducts: zod_1.z.array(BestSellingProductSchema).default([]),
    heroBanners: zod_1.z.array(HeroBannerSchema).default([]),
    promoBanners: zod_1.z.array(PromoBannerSchema).default([]),
    festivalBanners: zod_1.z.array(FestivalBannerSchema).default([]),
    reviews: zod_1.z.array(ProductReviewSchema).default([]),
});

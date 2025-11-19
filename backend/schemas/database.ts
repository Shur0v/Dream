/**
 * @fileoverview Zod schema guards for the JSON database payloads.
 * Ensures SSR/edge handlers never receive malformed objects before they
 * hydrate the UI. Each entity schema is intentionally permissive (passthrough)
 * so we can evolve the shape without failing existing data.
 */

import { z } from 'zod';

const TimestampSchema = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: 'Invalid ISO timestamp',
  })
  .or(z.literal(''))
  .default(() => new Date().toISOString());

const ColorSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    hexCode: z
      .string()
      .regex(/^#([0-9a-f]{6})$/i, 'Invalid HEX color')
      .default('#000000'),
    isActive: z.boolean().default(true),
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
  });

const CategorySchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().optional(),
    image: z.string().optional(),
    parentId: z.string().optional(),
    isActive: z.boolean().default(true),
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
  });

const ProductSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    description: z.string().default(''),
    price: z.preprocess((val) => (typeof val === 'string' ? Number(val) : val), z.number()).default(0),
    originalPrice: z.number().optional(),
    discount: z.number().optional(),
    images: z.array(z.string()).default([]),
    category: z.string(),
    categoryId: z.string().optional(),
    subcategory: z.string().optional(),
    brand: z.string().default(''),
    sku: z.string().default(''),
    stock: z.number().int().nonnegative().default(0),
    colors: z.array(z.string()).optional(),
    colorOptions: z.array(ColorSchema).optional(),
    size: z.array(z.string()).optional(),
    isActive: z.boolean().default(true),
    tags: z.array(z.string()).default([]),
    specifications: z.record(z.string(), z.unknown()).optional(),
    sellerId: z.string().min(1),
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
  });

const OrderItemSchema = z.object({
    id: z.string(),
    productId: z.string(),
    product: ProductSchema.optional(),
    quantity: z.number().int().nonnegative().default(1),
    price: z.number().nonnegative().default(0),
    color: z.string().optional(),
    size: z.string().optional(),
  });

const AddressSchema = z.object({
  street: z.string().default(''),
  city: z.string().default(''),
  state: z.string().default(''),
  zipCode: z.string().default(''),
  country: z.string().default(''),
});

const OrderStatusSchema = z.enum([
  'pending',
  'confirmed',
  'approved',
  'rejected',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
]);

const PaymentStatusSchema = z.enum(['pending', 'paid', 'failed', 'refunded']);

const OrderSchema = z.object({
    id: z.string(),
    userId: z.string(),
    items: z.array(OrderItemSchema).default([]),
  status: OrderStatusSchema.default('pending'),
    totalAmount: z.number().nonnegative().default(0),
    shippingAddress: AddressSchema,
    billingAddress: AddressSchema.optional(),
  paymentMethod: z.string().default(''),
  paymentStatus: PaymentStatusSchema.default('pending'),
    trackingNumber: z.string().optional(),
    notes: z.string().optional(),
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
  });

const UserRoleSchema = z.enum(['client', 'seller', 'reseller', 'super-admin']);

const UserSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
  role: UserRoleSchema.default('client'),
    avatar: z.string().optional(),
    phone: z.string().optional(),
    address: AddressSchema.optional(),
    isEmailVerified: z.boolean().default(false),
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
  });

export const DatabaseSchema = z.object({
  products: z.array(ProductSchema).default([]),
  orders: z.array(OrderSchema).default([]),
  categories: z.array(CategorySchema).default([]),
  colors: z.array(ColorSchema).default([]),
  users: z.array(UserSchema).default([]),
});

export type DatabaseShape = z.infer<typeof DatabaseSchema>;


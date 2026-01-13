"use strict";
/**
 * @fileoverview Database helper functions for MongoDB operations
 * Provides read/write operations using MongoDB
 *
 * @description This file handles all database operations:
 * - Reading from MongoDB
 * - Writing to MongoDB
 * - Type-safe operations
 *
 * @author Your Name
 * @version 2.0.0
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = getProducts;
exports.invalidateProductsCache = invalidateProductsCache;
exports.getProductById = getProductById;
exports.saveProduct = saveProduct;
exports.deleteProduct = deleteProduct;
exports.removeProductImage = removeProductImage;
exports.getOrders = getOrders;
exports.getOrderById = getOrderById;
exports.saveOrder = saveOrder;
exports.getCategories = getCategories;
exports.getCategoryById = getCategoryById;
exports.getCategoryBySlug = getCategoryBySlug;
exports.saveCategory = saveCategory;
exports.deleteCategory = deleteCategory;
exports.getColors = getColors;
exports.invalidateColorsCache = invalidateColorsCache;
exports.getColorById = getColorById;
exports.saveColor = saveColor;
exports.deleteColor = deleteColor;
exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.getUserByEmail = getUserByEmail;
exports.saveUser = saveUser;
exports.getFeaturedProducts = getFeaturedProducts;
exports.getFeaturedProductById = getFeaturedProductById;
exports.getFeaturedProductByProductId = getFeaturedProductByProductId;
exports.addFeaturedProduct = addFeaturedProduct;
exports.removeFeaturedProduct = removeFeaturedProduct;
exports.removeFeaturedProductById = removeFeaturedProductById;
exports.updateFeaturedProduct = updateFeaturedProduct;
exports.getBestSellingProducts = getBestSellingProducts;
exports.getBestSellingProductById = getBestSellingProductById;
exports.getBestSellingProductByProductId = getBestSellingProductByProductId;
exports.addBestSellingProduct = addBestSellingProduct;
exports.removeBestSellingProduct = removeBestSellingProduct;
exports.removeBestSellingProductById = removeBestSellingProductById;
exports.updateBestSellingProduct = updateBestSellingProduct;
exports.getHeroBanner = getHeroBanner;
exports.getHeroBannerById = getHeroBannerById;
exports.saveHeroBanner = saveHeroBanner;
exports.deleteHeroBanner = deleteHeroBanner;
exports.getAllHeroBanners = getAllHeroBanners;
exports.getPromoBanners = getPromoBanners;
exports.getPromoBannerById = getPromoBannerById;
exports.savePromoBanner = savePromoBanner;
exports.deletePromoBanner = deletePromoBanner;
exports.getFestivalBanners = getFestivalBanners;
exports.getFestivalBannerById = getFestivalBannerById;
exports.saveFestivalBanner = saveFestivalBanner;
exports.deleteFestivalBanner = deleteFestivalBanner;
exports.getReviews = getReviews;
exports.getReviewById = getReviewById;
exports.getReviewsByProduct = getReviewsByProduct;
exports.saveReview = saveReview;
exports.deleteReview = deleteReview;
const database_1 = require("../config/database");
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = require("../models");
// In-memory cache for products (with TTL)
let productsCache = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache
// In-memory cache for colors
let colorsCache = null;
const COLORS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache
/**
 * Helper to convert MongoDB document to type with id
 */
function toType(doc) {
    if (!doc)
        return doc;
    const { _id, ...rest } = doc;
    // Prioritize stored id field, fallback to _id.toString()
    // This matches the ProductSchema toJSON transform behavior
    const id = rest.id || _id?.toString();
    return { ...rest, id };
}
/**
 * Get all products (with caching)
 * @returns Promise<Product[]>
 */
async function getProducts() {
    const startTime = Date.now();
    await (0, database_1.ensureConnection)();
    // Check cache validity
    const now = Date.now();
    if (productsCache && (now - productsCache.timestamp) < CACHE_TTL) {
        console.log(`[MongoDB] getProducts: Using cache (${Date.now() - startTime}ms)`);
        return productsCache.data;
    }
    // Fetch from MongoDB
    console.log('[MongoDB] getProducts: Fetching from MongoDB...');
    const products = await models_1.ProductModel.find({ isActive: true }).lean().limit(1000);
    const typedProducts = products.map((toType));
    const fetchTime = Date.now() - startTime;
    console.log(`[MongoDB] getProducts: Fetched ${typedProducts.length} products in ${fetchTime}ms`);
    // Log sample product IDs for debugging
    if (typedProducts.length > 0) {
        console.log('[MongoDB] getProducts: Sample product IDs:', typedProducts.slice(0, 3).map(p => ({
            id: p.id,
            name: p.name,
            idType: typeof p.id,
            idLength: p.id?.length
        })));
    }
    // Update cache
    productsCache = {
        data: typedProducts,
        timestamp: now,
    };
    return typedProducts;
}
/**
 * Invalidate products cache (call after write operations)
 */
function invalidateProductsCache() {
    productsCache = null;
}
/**
 * Get product by ID
 * @param id - Product ID
 * @returns Promise<Product | undefined>
 */
async function getProductById(id) {
    await (0, database_1.ensureConnection)();
    // Try MongoDB ObjectId first
    let product = null;
    if (mongoose_1.default.Types.ObjectId.isValid(id)) {
        product = await models_1.ProductModel.findById(id).lean();
    }
    // If not found, try custom id field
    if (!product) {
        product = await models_1.ProductModel.findOne({ id: id }).lean();
    }
    // If still not found, try _id as string
    if (!product) {
        const allProducts = await models_1.ProductModel.find({}).lean();
        product = allProducts.find(p => p._id?.toString() === id) || null;
    }
    return product ? toType(product) : undefined;
}
/**
 * Save product (create or update)
 * @param product - Product to save
 * @returns Promise<Product>
 */
async function saveProduct(product) {
    try {
        await (0, database_1.ensureConnection)();
        const { id, ...productData } = product;
        const updateData = {
            ...productData,
            id: id, // Include the id field so it's stored in MongoDB
            updatedAt: new Date().toISOString(),
        };
        let saved;
        if (id && mongoose_1.default.Types.ObjectId.isValid(id)) {
            // Update existing document by MongoDB ObjectId
            saved = await models_1.ProductModel.findByIdAndUpdate(id, updateData, { new: true, setDefaultsOnInsert: true }).lean();
        }
        else if (id) {
            // Try to find by custom id field first
            const existing = await models_1.ProductModel.findOne({ id: id }).lean();
            if (existing) {
                // Update existing document
                saved = await models_1.ProductModel.findByIdAndUpdate(existing._id, updateData, { new: true, setDefaultsOnInsert: true }).lean();
            }
            else {
                // Create new document
                saved = await models_1.ProductModel.create(updateData);
                saved = saved.toObject();
            }
        }
        else {
            // Create new document without id (MongoDB will generate _id)
            saved = await models_1.ProductModel.create(updateData);
            saved = saved.toObject();
        }
        invalidateProductsCache();
        return toType(saved);
    }
    catch (error) {
        console.error('Error in saveProduct:', error);
        throw error;
    }
}
/**
 * Delete product (hard delete - permanently removes from database)
 * @param id - Product ID (can be MongoDB ObjectId or string)
 * @returns Promise<Product | null>
 */
async function deleteProduct(id) {
    try {
        await (0, database_1.ensureConnection)();
        // Validate ID format
        if (!id) {
            throw new Error('Product ID is required');
        }
        let product = null;
        let productIdToDelete = null;
        console.log(`[deleteProduct] Attempting to delete product with ID: ${id}`);
        // Priority 1: Try MongoDB ObjectId first (most common case since id field is often undefined)
        if (mongoose_1.default.Types.ObjectId.isValid(id)) {
            product = await models_1.ProductModel.findById(id).lean();
            if (product) {
                productIdToDelete = id;
                console.log(`[deleteProduct] Found product by MongoDB ObjectId: ${id}`);
            }
        }
        // Priority 2: Try to find by the custom id field (string)
        if (!product) {
            product = await models_1.ProductModel.findOne({ id: id }).lean();
            if (product && product._id) {
                productIdToDelete = product._id.toString();
                console.log(`[deleteProduct] Found product by custom id field: ${id}, MongoDB _id: ${productIdToDelete}`);
            }
        }
        // Priority 3: If still not found and id starts with "product-", try to extract timestamp
        // and find by matching the stored id field more flexibly
        if (!product && id.startsWith('product-')) {
            // Try exact match first
            product = await models_1.ProductModel.findOne({ id: id }).lean();
            if (product && product._id) {
                productIdToDelete = product._id.toString();
                console.log(`[deleteProduct] Found product by custom id (product- prefix): ${id}`);
            }
            // If still not found, try partial match or find by any product with similar pattern
            if (!product) {
                const allProducts = await models_1.ProductModel.find({}).lean();
                // Try to find by checking if any product's stored id matches
                const found = allProducts.find(p => {
                    const storedId = p.id;
                    if (storedId === id)
                        return true;
                    // Also check _id.toString() in case the id was transformed
                    if (p._id?.toString() === id)
                        return true;
                    return false;
                });
                if (found) {
                    product = found;
                    productIdToDelete = found._id.toString();
                    console.log(`[deleteProduct] Found product by scanning (product- prefix): ${id}`);
                }
            }
        }
        // Priority 4: Final fallback - scan all products and match by _id.toString()
        // This handles cases where id might be the _id string but ObjectId validation failed
        if (!product) {
            const allProducts = await models_1.ProductModel.find({}).lean();
            const found = allProducts.find(p => {
                // Check if _id.toString() matches the provided id
                if (p._id?.toString() === id)
                    return true;
                // Check if stored id field matches
                if (p.id === id)
                    return true;
                return false;
            });
            if (found) {
                product = found;
                productIdToDelete = found._id.toString();
                console.log(`[deleteProduct] Found product by final scan: ${id}`);
            }
        }
        if (!product || !productIdToDelete) {
            console.warn(`[deleteProduct] Product not found with ID: ${id}`);
            console.warn(`[deleteProduct] ID type: ${typeof id}, length: ${id.length}, isObjectId: ${mongoose_1.default.Types.ObjectId.isValid(id)}`);
            // Log all product IDs for debugging (first 20)
            const allProducts = await models_1.ProductModel.find({}).select('id _id name').lean().limit(20);
            const productInfo = allProducts.map(p => {
                const storedId = p.id;
                const mongoId = p._id?.toString();
                // Check what the API would return (via toJSON transform)
                const apiId = storedId || mongoId;
                return {
                    storedId: storedId || 'undefined',
                    mongoId: mongoId,
                    apiId: apiId, // This is what the API actually returns
                    name: p.name,
                    mongoIdMatches: mongoId === id,
                    storedIdMatches: storedId === id,
                    apiIdMatches: apiId === id
                };
            });
            console.log(`[deleteProduct] Available products (first 20):`, productInfo);
            // If id starts with "product-", it's likely a custom ID that wasn't stored
            // Try to find by matching the timestamp part or suggest using MongoDB ObjectId
            if (id.startsWith('product-')) {
                console.log(`[deleteProduct] ID starts with "product-", this is a custom ID format`);
                console.log(`[deleteProduct] The database doesn't store this format - products use MongoDB ObjectIds`);
                console.log(`[deleteProduct] The API should return MongoDB ObjectIds, but frontend is using custom ID`);
                console.log(`[deleteProduct] This suggests the frontend has cached/stale data`);
                console.log(`[deleteProduct] Solution: Clear browser cache and refresh the page`);
            }
            return null;
        }
        // Convert to Product type before deletion
        const productToReturn = toType(product);
        const productIdForCleanup = productToReturn.id || productIdToDelete;
        // Hard delete - actually remove from database using ObjectId
        await models_1.ProductModel.findByIdAndDelete(productIdToDelete);
        // Also remove from featured products if exists (don't throw error if not found)
        try {
            await models_1.FeaturedProductModel.findOneAndDelete({ productId: productIdForCleanup });
        }
        catch (err) {
            console.warn('Error removing from featured products (non-critical):', err);
        }
        // Also remove from best selling products if exists (don't throw error if not found)
        try {
            await models_1.BestSellingProductModel.findOneAndDelete({ productId: productIdForCleanup });
        }
        catch (err) {
            console.warn('Error removing from best selling products (non-critical):', err);
        }
        // Invalidate cache
        invalidateProductsCache();
        return productToReturn;
    }
    catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
}
/**
 * Remove a single image from a product
 * @param id - Product ID
 * @param imageIndex - Index of the image to remove
 * @returns Promise<Product | null>
 */
async function removeProductImage(id, imageIndex) {
    await (0, database_1.ensureConnection)();
    const product = await models_1.ProductModel.findById(id).lean();
    if (!product) {
        return null;
    }
    if (!Array.isArray(product.images) || imageIndex < 0 || imageIndex >= product.images.length) {
        return toType(product);
    }
    const updatedImages = product.images.filter((_, idx) => idx !== imageIndex);
    const updated = await models_1.ProductModel.findByIdAndUpdate(id, { images: updatedImages, updatedAt: new Date().toISOString() }, { new: true }).lean();
    invalidateProductsCache();
    return updated ? toType(updated) : null;
}
/**
 * Get all orders
 * @returns Promise<Order[]>
 */
async function getOrders() {
    await (0, database_1.ensureConnection)();
    const orders = await models_1.OrderModel.find({}).lean();
    return orders.map((toType));
}
/**
 * Get order by ID
 * @param id - Order ID
 * @returns Promise<Order | undefined>
 */
async function getOrderById(id) {
    await (0, database_1.ensureConnection)();
    const order = await models_1.OrderModel.findById(id).lean();
    return order ? toType(order) : undefined;
}
/**
 * Save order (create or update)
 * @param order - Order to save
 * @returns Promise<Order>
 */
async function saveOrder(order) {
    await (0, database_1.ensureConnection)();
    const { id, ...orderData } = order;
    const updateData = {
        ...orderData,
        updatedAt: new Date().toISOString(),
    };
    let saved;
    if (id && mongoose_1.default.Types.ObjectId.isValid(id)) {
        saved = await models_1.OrderModel.findByIdAndUpdate(id, updateData, { new: true, setDefaultsOnInsert: true }).lean();
    }
    else {
        saved = await models_1.OrderModel.create(updateData);
        saved = saved.toObject();
    }
    return toType(saved);
}
/**
 * Get all categories
 * @returns Promise<Category[]>
 */
async function getCategories() {
    const startTime = Date.now();
    await (0, database_1.ensureConnection)();
    console.log('[MongoDB] getCategories: Fetching from MongoDB...');
    const categories = await models_1.CategoryModel.find({ isActive: true }).lean();
    const typedCategories = categories.map((toType));
    console.log(`[MongoDB] getCategories: Fetched ${typedCategories.length} categories in ${Date.now() - startTime}ms`);
    return typedCategories;
}
/**
 * Get category by ID
 * @param id - Category ID
 * @returns Promise<Category | undefined>
 */
async function getCategoryById(id) {
    await (0, database_1.ensureConnection)();
    const category = await models_1.CategoryModel.findById(id).lean();
    return category ? toType(category) : undefined;
}
/**
 * Get category by slug
 * @param slug - Category slug
 * @returns Promise<Category | undefined>
 */
async function getCategoryBySlug(slug) {
    await (0, database_1.ensureConnection)();
    const category = await models_1.CategoryModel.findOne({ slug, isActive: true }).lean();
    return category ? toType(category) : undefined;
}
/**
 * Save category (create or update)
 * @param category - Category to save
 * @returns Promise<Category>
 */
async function saveCategory(category) {
    await (0, database_1.ensureConnection)();
    const { id, ...categoryData } = category;
    const updateData = {
        ...categoryData,
        updatedAt: new Date().toISOString(),
    };
    let saved;
    if (id && mongoose_1.default.Types.ObjectId.isValid(id)) {
        saved = await models_1.CategoryModel.findByIdAndUpdate(id, updateData, { new: true, setDefaultsOnInsert: true }).lean();
    }
    else if (id) {
        const existing = await models_1.CategoryModel.findOne({ id: id }).lean();
        if (existing) {
            saved = await models_1.CategoryModel.findByIdAndUpdate(existing._id, updateData, { new: true, setDefaultsOnInsert: true }).lean();
        }
        else {
            saved = await models_1.CategoryModel.create({ ...updateData, id: id });
            saved = saved.toObject();
        }
    }
    else {
        saved = await models_1.CategoryModel.create(updateData);
        saved = saved.toObject();
    }
    return toType(saved);
}
/**
 * Delete category (soft delete)
 * @param id - Category ID
 * @returns Promise<Category | null>
 */
async function deleteCategory(id) {
    await (0, database_1.ensureConnection)();
    let category;
    if (mongoose_1.default.Types.ObjectId.isValid(id)) {
        category = await models_1.CategoryModel.findByIdAndUpdate(id, { isActive: false, updatedAt: new Date().toISOString() }, { new: true }).lean();
    }
    else {
        const existing = await models_1.CategoryModel.findOne({ id: id }).lean();
        if (existing) {
            category = await models_1.CategoryModel.findByIdAndUpdate(existing._id, { isActive: false, updatedAt: new Date().toISOString() }, { new: true }).lean();
        }
    }
    return category ? toType(category) : null;
}
/**
 * Get all colors (with caching)
 * @returns Promise<Color[]>
 */
async function getColors() {
    const startTime = Date.now();
    // Check cache validity
    const now = Date.now();
    if (colorsCache && (now - colorsCache.timestamp) < COLORS_CACHE_TTL) {
        console.log(`[MongoDB] getColors: Using cache (${Date.now() - startTime}ms)`);
        return colorsCache.data;
    }
    // Fetch from MongoDB
    await (0, database_1.ensureConnection)();
    console.log('[MongoDB] getColors: Fetching from MongoDB...');
    const colors = await models_1.ColorModel.find({ isActive: true }).lean();
    const typedColors = colors.map((toType));
    console.log(`[MongoDB] getColors: Fetched ${typedColors.length} colors in ${Date.now() - startTime}ms`);
    // Update cache
    colorsCache = {
        data: typedColors,
        timestamp: now,
    };
    return typedColors;
}
/**
 * Invalidate colors cache (call after write operations)
 */
function invalidateColorsCache() {
    colorsCache = null;
}
/**
 * Get color by ID
 * @param id - Color ID
 * @returns Promise<Color | undefined>
 */
async function getColorById(id) {
    await (0, database_1.ensureConnection)();
    const color = await models_1.ColorModel.findById(id).lean();
    return color ? toType(color) : undefined;
}
/**
 * Save color (create or update)
 * @param color - Color to save
 * @returns Promise<Color>
 */
async function saveColor(color) {
    await (0, database_1.ensureConnection)();
    const { id, ...colorData } = color;
    const updateData = {
        ...colorData,
        updatedAt: new Date().toISOString(),
    };
    let saved;
    if (id && mongoose_1.default.Types.ObjectId.isValid(id)) {
        saved = await models_1.ColorModel.findByIdAndUpdate(id, updateData, { new: true, setDefaultsOnInsert: true }).lean();
    }
    else {
        saved = await models_1.ColorModel.create(updateData);
        saved = saved.toObject();
    }
    invalidateColorsCache();
    return toType(saved);
}
/**
 * Delete color (soft delete)
 * @param id - Color ID
 * @returns Promise<Color | null>
 */
async function deleteColor(id) {
    await (0, database_1.ensureConnection)();
    const color = await models_1.ColorModel.findByIdAndUpdate(id, { isActive: false, updatedAt: new Date().toISOString() }, { new: true }).lean();
    if (color) {
        invalidateColorsCache();
        return toType(color);
    }
    return null;
}
/**
 * Get all users
 * @returns Promise<User[]>
 */
async function getUsers() {
    await (0, database_1.ensureConnection)();
    const users = await models_1.UserModel.find({}).lean();
    return users.map((toType));
}
/**
 * Get user by ID
 * @param id - User ID
 * @returns Promise<User | undefined>
 */
async function getUserById(id) {
    await (0, database_1.ensureConnection)();
    let user;
    if (mongoose_1.default.Types.ObjectId.isValid(id)) {
        user = await models_1.UserModel.findById(id).lean();
    }
    else {
        user = await models_1.UserModel.findOne({ id: id }).lean();
    }
    return user ? toType(user) : undefined;
}
/**
 * Get user by email
 * @param email - User email
 * @returns Promise<User | undefined>
 */
async function getUserByEmail(email) {
    await (0, database_1.ensureConnection)();
    const user = await models_1.UserModel.findOne({ email }).lean();
    return user ? toType(user) : undefined;
}
/**
 * Save user (create or update)
 * @param user - User to save
 * @returns Promise<User>
 */
async function saveUser(user) {
    await (0, database_1.ensureConnection)();
    // Check if user exists by email
    const existingUser = await models_1.UserModel.findOne({ email: user.email }).lean();
    let saved;
    if (existingUser) {
        // Update existing user
        const updateData = {
            ...user,
            lastName: user.lastName !== undefined ? user.lastName : existingUser.lastName || '',
            updatedAt: new Date().toISOString(),
        };
        saved = await models_1.UserModel.findByIdAndUpdate(existingUser._id, updateData, {
            new: true,
            setDefaultsOnInsert: true,
            writeConcern: { w: 1 } // Use numeric 1 to avoid write concern parsing issues
        }).lean();
    }
    else {
        // Create new user
        const newUserData = {
            ...user,
            lastName: user.lastName || '', // Ensure lastName is always set
            role: user.role || 'client',
            isEmailVerified: user.isEmailVerified || false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        saved = await models_1.UserModel.create(newUserData);
        saved = saved.toObject();
    }
    return toType(saved);
}
/**
 * Get all featured products (only active ones)
 * @returns Promise<FeaturedProduct[]>
 */
async function getFeaturedProducts() {
    const startTime = Date.now();
    await (0, database_1.ensureConnection)();
    console.log('[MongoDB] getFeaturedProducts: Fetching from MongoDB...');
    const featuredProducts = await models_1.FeaturedProductModel.find({ isActive: true }).lean();
    const typed = featuredProducts.map((toType));
    console.log(`[MongoDB] getFeaturedProducts: Fetched ${typed.length} products in ${Date.now() - startTime}ms`);
    return typed;
}
/**
 * Get featured product by ID
 * @param id - Featured Product ID
 * @returns Promise<FeaturedProduct | undefined>
 */
async function getFeaturedProductById(id) {
    await (0, database_1.ensureConnection)();
    const featuredProduct = await models_1.FeaturedProductModel.findById(id).lean();
    return featuredProduct ? toType(featuredProduct) : undefined;
}
/**
 * Get featured product by product ID
 * @param productId - Original Product ID
 * @returns Promise<FeaturedProduct | undefined>
 */
async function getFeaturedProductByProductId(productId) {
    await (0, database_1.ensureConnection)();
    const featuredProduct = await models_1.FeaturedProductModel.findOne({ productId, isActive: true }).lean();
    return featuredProduct ? toType(featuredProduct) : undefined;
}
/**
 * Add product as featured (creates a copy from the original product)
 * @param productId - Product ID to feature
 * @returns Promise<FeaturedProduct>
 */
async function addFeaturedProduct(productId) {
    await (0, database_1.ensureConnection)();
    // Check if already featured
    const existing = await models_1.FeaturedProductModel.findOne({ productId, isActive: true }).lean();
    if (existing) {
        return toType(existing);
    }
    // Get the original product
    const product = await getProductById(productId);
    if (!product) {
        throw new Error(`Product with ID ${productId} not found`);
    }
    // Create a copy of the product as featured product
    const featuredProductData = {
        ...product,
        id: `featured-${productId}-${Date.now()}`,
        productId: product.id,
        featuredAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
    };
    const saved = await models_1.FeaturedProductModel.create(featuredProductData);
    return toType(saved.toObject());
}
/**
 * Remove product from featured (soft delete)
 * @param productId - Product ID to remove from featured
 * @returns Promise<FeaturedProduct | null>
 */
async function removeFeaturedProduct(productId) {
    await (0, database_1.ensureConnection)();
    const featuredProduct = await models_1.FeaturedProductModel.findOneAndUpdate({ productId, isActive: true }, { isActive: false, updatedAt: new Date().toISOString() }, { new: true }).lean();
    return featuredProduct ? toType(featuredProduct) : null;
}
/**
 * Remove featured product by featured product ID
 * @param id - Featured Product ID
 * @returns Promise<FeaturedProduct | null>
 */
async function removeFeaturedProductById(id) {
    await (0, database_1.ensureConnection)();
    let featuredProduct;
    if (mongoose_1.default.Types.ObjectId.isValid(id)) {
        featuredProduct = await models_1.FeaturedProductModel.findByIdAndUpdate(id, { isActive: false, updatedAt: new Date().toISOString() }, { new: true }).lean();
    }
    else {
        const existing = await models_1.FeaturedProductModel.findOne({ id }).lean();
        if (existing) {
            featuredProduct = await models_1.FeaturedProductModel.findByIdAndUpdate(existing._id, { isActive: false, updatedAt: new Date().toISOString() }, { new: true }).lean();
        }
    }
    return featuredProduct ? toType(featuredProduct) : null;
}
/**
 * Update featured product data (syncs with original product)
 * @param productId - Original Product ID
 * @returns Promise<FeaturedProduct | null>
 */
async function updateFeaturedProduct(productId) {
    await (0, database_1.ensureConnection)();
    const featuredProduct = await models_1.FeaturedProductModel.findOne({ productId, isActive: true }).lean();
    if (!featuredProduct) {
        return null;
    }
    const product = await getProductById(productId);
    if (!product) {
        return null;
    }
    const updateData = {
        ...product,
        id: featuredProduct.id,
        productId: product.id,
        featuredAt: featuredProduct.featuredAt,
        updatedAt: new Date().toISOString(),
    };
    const updated = await models_1.FeaturedProductModel.findByIdAndUpdate(featuredProduct._id, updateData, { new: true }).lean();
    return updated ? toType(updated) : null;
}
/**
 * Get all best selling products (only active ones)
 * @returns Promise<BestSellingProduct[]>
 */
async function getBestSellingProducts() {
    const startTime = Date.now();
    await (0, database_1.ensureConnection)();
    console.log('[MongoDB] getBestSellingProducts: Fetching from MongoDB...');
    const bestSellingProducts = await models_1.BestSellingProductModel.find({ isActive: true }).lean();
    const typed = bestSellingProducts.map((toType));
    console.log(`[MongoDB] getBestSellingProducts: Fetched ${typed.length} products in ${Date.now() - startTime}ms`);
    return typed;
}
/**
 * Get best selling product by ID
 * @param id - Best Selling Product ID
 * @returns Promise<BestSellingProduct | undefined>
 */
async function getBestSellingProductById(id) {
    await (0, database_1.ensureConnection)();
    const bestSellingProduct = await models_1.BestSellingProductModel.findById(id).lean();
    return bestSellingProduct ? toType(bestSellingProduct) : undefined;
}
/**
 * Get best selling product by product ID
 * @param productId - Original Product ID
 * @returns Promise<BestSellingProduct | undefined>
 */
async function getBestSellingProductByProductId(productId) {
    await (0, database_1.ensureConnection)();
    const bestSellingProduct = await models_1.BestSellingProductModel.findOne({ productId, isActive: true }).lean();
    return bestSellingProduct ? toType(bestSellingProduct) : undefined;
}
/**
 * Add product as best selling (creates a copy from the original product)
 * @param productId - Product ID to mark as best selling
 * @returns Promise<BestSellingProduct>
 */
async function addBestSellingProduct(productId) {
    await (0, database_1.ensureConnection)();
    // Check if already best selling
    const existing = await models_1.BestSellingProductModel.findOne({ productId, isActive: true }).lean();
    if (existing) {
        return toType(existing);
    }
    // Get the original product
    const product = await getProductById(productId);
    if (!product) {
        throw new Error(`Product with ID ${productId} not found`);
    }
    // Create a copy of the product as best selling product
    const bestSellingProductData = {
        ...product,
        id: `bestselling-${productId}-${Date.now()}`,
        productId: product.id,
        bestSellingAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
    };
    const saved = await models_1.BestSellingProductModel.create(bestSellingProductData);
    return toType(saved.toObject());
}
/**
 * Remove product from best selling (soft delete)
 * @param productId - Product ID to remove from best selling
 * @returns Promise<BestSellingProduct | null>
 */
async function removeBestSellingProduct(productId) {
    await (0, database_1.ensureConnection)();
    const bestSellingProduct = await models_1.BestSellingProductModel.findOneAndUpdate({ productId, isActive: true }, { isActive: false, updatedAt: new Date().toISOString() }, { new: true }).lean();
    return bestSellingProduct ? toType(bestSellingProduct) : null;
}
/**
 * Remove best selling product by best selling product ID
 * @param id - Best Selling Product ID
 * @returns Promise<BestSellingProduct | null>
 */
async function removeBestSellingProductById(id) {
    await (0, database_1.ensureConnection)();
    let bestSellingProduct;
    if (mongoose_1.default.Types.ObjectId.isValid(id)) {
        bestSellingProduct = await models_1.BestSellingProductModel.findByIdAndUpdate(id, { isActive: false, updatedAt: new Date().toISOString() }, { new: true }).lean();
    }
    else {
        const existing = await models_1.BestSellingProductModel.findOne({ id }).lean();
        if (existing) {
            bestSellingProduct = await models_1.BestSellingProductModel.findByIdAndUpdate(existing._id, { isActive: false, updatedAt: new Date().toISOString() }, { new: true }).lean();
        }
    }
    return bestSellingProduct ? toType(bestSellingProduct) : null;
}
/**
 * Update best selling product data (syncs with original product)
 * @param productId - Original Product ID
 * @returns Promise<BestSellingProduct | null>
 */
async function updateBestSellingProduct(productId) {
    await (0, database_1.ensureConnection)();
    const bestSellingProduct = await models_1.BestSellingProductModel.findOne({ productId, isActive: true }).lean();
    if (!bestSellingProduct) {
        return null;
    }
    const product = await getProductById(productId);
    if (!product) {
        return null;
    }
    const updateData = {
        ...product,
        id: bestSellingProduct.id,
        productId: product.id,
        bestSellingAt: bestSellingProduct.bestSellingAt,
        updatedAt: new Date().toISOString(),
    };
    const updated = await models_1.BestSellingProductModel.findByIdAndUpdate(bestSellingProduct._id, updateData, { new: true }).lean();
    return updated ? toType(updated) : null;
}
/**
 * Get active hero banner
 * @returns Promise<HeroBanner | null>
 */
async function getHeroBanner() {
    const startTime = Date.now();
    await (0, database_1.ensureConnection)();
    console.log('[MongoDB] getHeroBanner: Fetching from MongoDB...');
    const heroBanner = await models_1.HeroBannerModel.findOne({ isActive: true }).lean();
    const result = heroBanner ? toType(heroBanner) : null;
    console.log(`[MongoDB] getHeroBanner: Fetched in ${Date.now() - startTime}ms`);
    return result;
}
/**
 * Get hero banner by ID
 * @param id - Hero Banner ID
 * @returns Promise<HeroBanner | undefined>
 */
async function getHeroBannerById(id) {
    await (0, database_1.ensureConnection)();
    const heroBanner = await models_1.HeroBannerModel.findById(id).lean();
    return heroBanner ? toType(heroBanner) : undefined;
}
/**
 * Save hero banner (create or update)
 * @param heroBanner - Hero Banner to save
 * @returns Promise<HeroBanner>
 */
async function saveHeroBanner(heroBanner) {
    await (0, database_1.ensureConnection)();
    const { id, ...bannerData } = heroBanner;
    const updateData = {
        ...bannerData,
        id: id || `hero-${Date.now()}`,
        updatedAt: new Date().toISOString(),
    };
    // If this banner is set to active, deactivate all others
    if (heroBanner.isActive) {
        await models_1.HeroBannerModel.updateMany({ isActive: true, id: { $ne: updateData.id } }, { isActive: false });
    }
    let saved;
    if (id && mongoose_1.default.Types.ObjectId.isValid(id)) {
        saved = await models_1.HeroBannerModel.findByIdAndUpdate(id, updateData, { new: true, setDefaultsOnInsert: true, upsert: true }).lean();
    }
    else if (id) {
        const existing = await models_1.HeroBannerModel.findOne({ id }).lean();
        if (existing) {
            saved = await models_1.HeroBannerModel.findByIdAndUpdate(existing._id, updateData, { new: true }).lean();
        }
        else {
            saved = await models_1.HeroBannerModel.create({ ...updateData, createdAt: new Date().toISOString() });
            saved = saved.toObject();
        }
    }
    else {
        saved = await models_1.HeroBannerModel.create({ ...updateData, createdAt: new Date().toISOString() });
        saved = saved.toObject();
    }
    return toType(saved);
}
/**
 * Delete hero banner (soft delete)
 * @param id - Hero Banner ID
 * @returns Promise<HeroBanner | null>
 */
async function deleteHeroBanner(id) {
    await (0, database_1.ensureConnection)();
    let heroBanner;
    if (mongoose_1.default.Types.ObjectId.isValid(id)) {
        heroBanner = await models_1.HeroBannerModel.findByIdAndUpdate(id, { isActive: false, updatedAt: new Date().toISOString() }, { new: true }).lean();
    }
    else {
        const existing = await models_1.HeroBannerModel.findOne({ id }).lean();
        if (existing) {
            heroBanner = await models_1.HeroBannerModel.findByIdAndUpdate(existing._id, { isActive: false, updatedAt: new Date().toISOString() }, { new: true }).lean();
        }
    }
    return heroBanner ? toType(heroBanner) : null;
}
/**
 * Get all hero banners (including inactive)
 * @returns Promise<HeroBanner[]>
 */
async function getAllHeroBanners() {
    await (0, database_1.ensureConnection)();
    const banners = await models_1.HeroBannerModel.find({}).lean();
    return banners.map((toType));
}
const defaultPromoCountdown = () => ({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
});
const sortPromoBanners = (a, b) => {
    if ((a.order ?? 0) !== (b.order ?? 0)) {
        return (a.order ?? 0) - (b.order ?? 0);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
};
async function getPromoBanners(options = {}) {
    const startTime = Date.now();
    const { includeInactive = false, variant, limit } = options;
    await (0, database_1.ensureConnection)();
    console.log('[MongoDB] getPromoBanners: Fetching from MongoDB...');
    let query = {};
    if (!includeInactive) {
        query.isActive = true;
    }
    if (variant) {
        query.variant = variant;
    }
    let banners = await models_1.PromoBannerModel.find(query).lean();
    banners = banners.map((toType));
    const sorted = [...banners].sort(sortPromoBanners);
    const result = limit && limit > 0 ? sorted.slice(0, limit) : sorted;
    console.log(`[MongoDB] getPromoBanners: Fetched ${result.length} banners in ${Date.now() - startTime}ms`);
    return result;
}
async function getPromoBannerById(id) {
    await (0, database_1.ensureConnection)();
    const promoBanner = await models_1.PromoBannerModel.findById(id).lean();
    return promoBanner ? toType(promoBanner) : undefined;
}
async function savePromoBanner(promoBanner) {
    await (0, database_1.ensureConnection)();
    const count = await models_1.PromoBannerModel.countDocuments();
    const normalized = {
        ...promoBanner,
        id: promoBanner.id || `promo-${Date.now()}`,
        initialTime: promoBanner.initialTime ?? defaultPromoCountdown(),
        variant: promoBanner.variant ?? 'slider',
        order: typeof promoBanner.order === 'number' ? promoBanner.order : count,
        updatedAt: new Date().toISOString(),
        isActive: promoBanner.isActive !== undefined ? promoBanner.isActive : true,
    };
    let saved;
    if (normalized.id && mongoose_1.default.Types.ObjectId.isValid(normalized.id)) {
        saved = await models_1.PromoBannerModel.findByIdAndUpdate(normalized.id, normalized, { new: true, setDefaultsOnInsert: true, upsert: true }).lean();
    }
    else if (normalized.id) {
        const existing = await models_1.PromoBannerModel.findOne({ id: normalized.id }).lean();
        if (existing) {
            saved = await models_1.PromoBannerModel.findByIdAndUpdate(existing._id, normalized, { new: true }).lean();
        }
        else {
            saved = await models_1.PromoBannerModel.create({ ...normalized, createdAt: new Date().toISOString() });
            saved = saved.toObject();
        }
    }
    else {
        saved = await models_1.PromoBannerModel.create({ ...normalized, createdAt: new Date().toISOString() });
        saved = saved.toObject();
    }
    return toType(saved);
}
async function deletePromoBanner(id) {
    await (0, database_1.ensureConnection)();
    let banner;
    if (mongoose_1.default.Types.ObjectId.isValid(id)) {
        banner = await models_1.PromoBannerModel.findByIdAndUpdate(id, { isActive: false, updatedAt: new Date().toISOString() }, { new: true }).lean();
    }
    else {
        const existing = await models_1.PromoBannerModel.findOne({ id }).lean();
        if (existing) {
            banner = await models_1.PromoBannerModel.findByIdAndUpdate(existing._id, { isActive: false, updatedAt: new Date().toISOString() }, { new: true }).lean();
        }
    }
    return banner ? toType(banner) : null;
}
const sortFestivalBanners = (a, b) => {
    if ((a.order ?? 0) !== (b.order ?? 0)) {
        return (a.order ?? 0) - (b.order ?? 0);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
};
const normalizeCoupons = (coupons) => {
    if (!Array.isArray(coupons))
        return [];
    return coupons
        .map(coupon => ({
        code: String(coupon?.code ?? '').trim(),
        amount: String(coupon?.amount ?? '').trim(),
    }))
        .filter(coupon => coupon.code && coupon.amount);
};
async function getFestivalBanners(options = {}) {
    const startTime = Date.now();
    const { includeInactive = false, limit } = options;
    await (0, database_1.ensureConnection)();
    console.log('[MongoDB] getFestivalBanners: Fetching from MongoDB...');
    let query = {};
    if (!includeInactive) {
        query.isActive = true;
    }
    let banners = await models_1.FestivalBannerModel.find(query).lean();
    banners = banners.map((toType));
    const sorted = [...banners].sort(sortFestivalBanners);
    const result = limit && limit > 0 ? sorted.slice(0, limit) : sorted;
    console.log(`[MongoDB] getFestivalBanners: Fetched ${result.length} banners in ${Date.now() - startTime}ms`);
    return result;
}
async function getFestivalBannerById(id) {
    await (0, database_1.ensureConnection)();
    const banner = await models_1.FestivalBannerModel.findById(id).lean();
    return banner ? toType(banner) : undefined;
}
async function saveFestivalBanner(banner) {
    await (0, database_1.ensureConnection)();
    const count = await models_1.FestivalBannerModel.countDocuments();
    const normalized = {
        ...banner,
        id: banner.id || `festival-${Date.now()}`,
        coupons: normalizeCoupons(banner.coupons),
        order: typeof banner.order === 'number' ? banner.order : count,
        updatedAt: new Date().toISOString(),
        isActive: banner.isActive !== undefined ? banner.isActive : true,
    };
    let saved;
    if (normalized.id && mongoose_1.default.Types.ObjectId.isValid(normalized.id)) {
        saved = await models_1.FestivalBannerModel.findByIdAndUpdate(normalized.id, normalized, { new: true, setDefaultsOnInsert: true, upsert: true }).lean();
    }
    else if (normalized.id) {
        const existing = await models_1.FestivalBannerModel.findOne({ id: normalized.id }).lean();
        if (existing) {
            saved = await models_1.FestivalBannerModel.findByIdAndUpdate(existing._id, { ...normalized, coupons: normalizeCoupons(normalized.coupons || []) }, { new: true }).lean();
        }
        else {
            saved = await models_1.FestivalBannerModel.create({ ...normalized, createdAt: new Date().toISOString() });
            saved = saved.toObject();
        }
    }
    else {
        saved = await models_1.FestivalBannerModel.create({ ...normalized, createdAt: new Date().toISOString() });
        saved = saved.toObject();
    }
    return toType(saved);
}
async function deleteFestivalBanner(id) {
    await (0, database_1.ensureConnection)();
    let banner;
    if (mongoose_1.default.Types.ObjectId.isValid(id)) {
        banner = await models_1.FestivalBannerModel.findByIdAndUpdate(id, { isActive: false, updatedAt: new Date().toISOString() }, { new: true }).lean();
    }
    else {
        const existing = await models_1.FestivalBannerModel.findOne({ id }).lean();
        if (existing) {
            banner = await models_1.FestivalBannerModel.findByIdAndUpdate(existing._id, { isActive: false, updatedAt: new Date().toISOString() }, { new: true }).lean();
        }
    }
    return banner ? toType(banner) : null;
}
const clampRating = (value) => {
    if (Number.isNaN(value))
        return 5;
    if (value < 1)
        return 1;
    if (value > 5)
        return 5;
    return Number(value);
};
const normalizeReview = (review, fallbackProductName) => {
    const now = new Date().toISOString();
    const trimmedComment = (review.comment || '').trim();
    const trimmedAuthor = (review.author || 'Anonymous').trim() || 'Anonymous';
    return {
        id: review.id || `rev-${Date.now()}`,
        productId: String(review.productId),
        productName: review.productName || fallbackProductName,
        author: trimmedAuthor,
        rating: clampRating(review.rating ?? 5),
        comment: trimmedComment,
        date: review.date || now,
        verified: Boolean(review.verified),
        source: review.source || 'admin',
        createdAt: review.createdAt || now,
        updatedAt: now,
    };
};
async function getReviews(productId, productName) {
    const startTime = Date.now();
    await (0, database_1.ensureConnection)();
    let query = {};
    if (productId) {
        // Support both ObjectId and string productId matching
        // Try exact match first
        query.productId = productId;
        console.log(`[MongoDB] getReviews: Searching for productId="${productId}"`);
        // If productName is also provided, use OR query to find by either productId or productName
        if (productName) {
            query = {
                $or: [
                    { productId: productId },
                    { productName: productName }
                ]
            };
            console.log(`[MongoDB] getReviews: Also searching for productName="${productName}"`);
        }
    }
    else {
        console.log('[MongoDB] getReviews: Fetching all reviews...');
    }
    const reviews = await models_1.ProductReviewModel.find(query).lean();
    const typed = reviews.map((toType));
    console.log(`[MongoDB] getReviews: Fetched ${typed.length} reviews in ${Date.now() - startTime}ms`);
    if (productId && typed.length === 0) {
        console.warn(`[MongoDB] getReviews: No reviews found for productId="${productId}". Checking all reviews...`);
        // Debug: Show all reviews to see what productIds exist
        const allReviews = await models_1.ProductReviewModel.find({}).lean().limit(10);
        console.log(`[MongoDB] getReviews: Sample productIds in database:`, allReviews.map((r) => ({ id: r._id?.toString(), productId: r.productId, productName: r.productName })));
    }
    return typed;
}
async function getReviewById(id) {
    await (0, database_1.ensureConnection)();
    const review = await models_1.ProductReviewModel.findById(id).lean();
    return review ? toType(review) : undefined;
}
async function getReviewsByProduct(productId, productName) {
    return getReviews(productId, productName);
}
async function saveReview(review) {
    await (0, database_1.ensureConnection)();
    // Get product name from MongoDB if productId is provided
    let productName;
    if (review.productId) {
        try {
            const product = await models_1.ProductModel.findById(review.productId).lean();
            if (product) {
                productName = product.name;
            }
        }
        catch (error) {
            console.warn('Could not fetch product name for review:', error);
        }
    }
    const normalized = normalizeReview(review, productName);
    // Check if review exists (only if id is a valid MongoDB ObjectId)
    let existingReview = null;
    if (normalized.id && mongoose_1.default.Types.ObjectId.isValid(normalized.id)) {
        existingReview = await models_1.ProductReviewModel.findById(normalized.id).lean();
    }
    let saved;
    if (existingReview) {
        // Update existing review
        const { id, createdAt, ...updateData } = normalized;
        // Preserve original createdAt when updating
        updateData.updatedAt = new Date().toISOString();
        saved = await models_1.ProductReviewModel.findByIdAndUpdate(existingReview._id, updateData, { new: true }).lean();
    }
    else {
        // Create new review - MongoDB will generate _id
        const { id, ...createData } = normalized;
        // Ensure timestamps are set
        if (!createData.createdAt) {
            createData.createdAt = new Date().toISOString();
        }
        if (!createData.updatedAt) {
            createData.updatedAt = new Date().toISOString();
        }
        saved = await models_1.ProductReviewModel.create(createData);
        saved = saved.toObject();
    }
    return toType(saved);
}
async function deleteReview(id) {
    await (0, database_1.ensureConnection)();
    // Validate MongoDB ObjectId
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        console.warn(`Invalid review ID format: ${id}`);
        return null;
    }
    const deleted = await models_1.ProductReviewModel.findByIdAndDelete(id).lean();
    if (!deleted) {
        return null;
    }
    return toType(deleted);
}

"use strict";
/**
 * Database helper functions for Express backend
 * Handles read/write operations for separate JSON database files
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = getProducts;
exports.saveProducts = saveProducts;
exports.getProductById = getProductById;
exports.saveProduct = saveProduct;
exports.deleteProduct = deleteProduct;
exports.getOrders = getOrders;
exports.saveOrders = saveOrders;
exports.getOrderById = getOrderById;
exports.saveOrder = saveOrder;
exports.getCategories = getCategories;
exports.saveCategories = saveCategories;
exports.getCategoryById = getCategoryById;
exports.getCategoryBySlug = getCategoryBySlug;
exports.saveCategory = saveCategory;
exports.deleteCategory = deleteCategory;
exports.getColors = getColors;
exports.saveColors = saveColors;
exports.getColorById = getColorById;
exports.saveColor = saveColor;
exports.deleteColor = deleteColor;
exports.getUsers = getUsers;
exports.saveUsers = saveUsers;
exports.getUserById = getUserById;
exports.saveUser = saveUser;
exports.invalidateProductsCache = invalidateProductsCache;
exports.invalidateOrdersCache = invalidateOrdersCache;
exports.invalidateCategoriesCache = invalidateCategoriesCache;
exports.invalidateColorsCache = invalidateColorsCache;
exports.invalidateUsersCache = invalidateUsersCache;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
// Database file paths
const DB_DIR = path_1.default.join(process.cwd(), 'backend', 'database');
const PRODUCTS_DB = path_1.default.join(DB_DIR, 'products.json');
const ORDERS_DB = path_1.default.join(DB_DIR, 'orders.json');
const CATEGORIES_DB = path_1.default.join(DB_DIR, 'categories.json');
const COLORS_DB = path_1.default.join(DB_DIR, 'colors.json');
const USERS_DB = path_1.default.join(DB_DIR, 'users.json');
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
let productsCache = null;
let ordersCache = null;
let categoriesCache = null;
let colorsCache = null;
let usersCache = null;
/**
 * Ensure database directory exists
 */
async function ensureDbDir() {
    try {
        await fs_1.promises.mkdir(DB_DIR, { recursive: true });
    }
    catch (error) {
        console.error('Error creating database directory:', error);
    }
}
/**
 * Read JSON file with caching
 */
async function readJsonFile(filePath, cache) {
    const now = Date.now();
    // Check cache
    if (cache && (now - cache.timestamp) < CACHE_TTL) {
        return cache.data;
    }
    try {
        const content = await fs_1.promises.readFile(filePath, 'utf-8');
        const data = JSON.parse(content);
        return data;
    }
    catch (error) {
        if (error.code === 'ENOENT') {
            // File doesn't exist, return empty array
            return [];
        }
        throw error;
    }
}
/**
 * Write JSON file and invalidate cache
 */
async function writeJsonFile(filePath, data) {
    try {
        await ensureDbDir();
        const content = JSON.stringify(data, null, 2);
        await fs_1.promises.writeFile(filePath, content, 'utf-8');
        console.log(`[db] Successfully wrote to ${path_1.default.basename(filePath)}`);
    }
    catch (error) {
        console.error(`[db] Error writing to ${filePath}:`, error);
        throw new Error(`Failed to write to database file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
// Products
async function getProducts() {
    const data = await readJsonFile(PRODUCTS_DB, productsCache);
    productsCache = { data, timestamp: Date.now() };
    return data;
}
async function saveProducts(products) {
    await writeJsonFile(PRODUCTS_DB, products);
    productsCache = null; // Invalidate cache
}
async function getProductById(id) {
    const products = await getProducts();
    return products.find(p => p.id === id);
}
async function saveProduct(product) {
    const products = await getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index >= 0) {
        products[index] = product;
    }
    else {
        products.push(product);
    }
    await saveProducts(products);
    return product;
}
async function deleteProduct(id) {
    console.log(`[express-lib/db] deleteProduct called with ID: ${id}`);
    const products = await getProducts();
    console.log(`[express-lib/db] Total products in JSON: ${products.length}`);
    // Try to find product by id
    let product = products.find(p => p.id === id);
    // If not found, log available IDs for debugging
    if (!product) {
        console.log(`[express-lib/db] Product not found with ID: ${id}`);
        console.log(`[express-lib/db] Available product IDs (first 10):`, products.slice(0, 10).map(p => ({
            id: p.id,
            name: p.name,
            idMatches: p.id === id
        })));
    }
    if (product) {
        // Hard delete - remove from array instead of soft delete
        const index = products.findIndex(p => p.id === id);
        if (index >= 0) {
            products.splice(index, 1);
            await saveProducts(products);
            console.log(`[express-lib/db] Product deleted successfully: ${id}`);
            return product;
        }
    }
    return null;
}
// Orders
async function getOrders() {
    const data = await readJsonFile(ORDERS_DB, ordersCache);
    // Always update cache after reading
    ordersCache = { data, timestamp: Date.now() };
    console.log(`[db] Retrieved ${data.length} orders from database`);
    return data;
}
async function saveOrders(orders) {
    // Invalidate cache before writing
    ordersCache = null;
    await writeJsonFile(ORDERS_DB, orders);
    // Invalidate cache again after writing to ensure fresh reads
    ordersCache = null;
    console.log(`[db] Orders saved. Total orders: ${orders.length}`);
}
async function getOrderById(id) {
    const orders = await getOrders();
    return orders.find(o => o.id === id);
}
async function saveOrder(order) {
    // Invalidate cache first to ensure we get fresh data
    ordersCache = null;
    const orders = await getOrders();
    const index = orders.findIndex(o => o.id === order.id);
    if (index >= 0) {
        orders[index] = order;
        console.log(`[db] Updating order: ${order.id}`);
    }
    else {
        orders.push(order);
        console.log(`[db] Creating new order: ${order.id} - Total orders now: ${orders.length + 1}`);
    }
    // Invalidate cache before saving
    ordersCache = null;
    await saveOrders(orders);
    // Invalidate cache after saving to ensure next read is fresh
    ordersCache = null;
    console.log(`[db] Order saved successfully. Total orders in database: ${orders.length}`);
    return order;
}
// Categories
async function getCategories() {
    const data = await readJsonFile(CATEGORIES_DB, categoriesCache);
    categoriesCache = { data, timestamp: Date.now() };
    return data;
}
async function saveCategories(categories) {
    // Invalidate cache before writing
    categoriesCache = null;
    await writeJsonFile(CATEGORIES_DB, categories);
    // Invalidate cache after writing to ensure fresh reads
    categoriesCache = null;
    console.log(`[db] Categories saved. Total categories: ${categories.length}`);
}
async function getCategoryById(id) {
    const categories = await getCategories();
    return categories.find(c => c.id === id);
}
async function getCategoryBySlug(slug) {
    const categories = await getCategories();
    return categories.find(c => c.slug === slug);
}
async function saveCategory(category) {
    try {
        // Invalidate cache first to ensure we get fresh data
        categoriesCache = null;
        const categories = await getCategories();
        const index = categories.findIndex(c => c.id === category.id);
        if (index >= 0) {
            categories[index] = category;
            console.log(`[db] Updating category: ${category.id}`);
        }
        else {
            categories.push(category);
            console.log(`[db] Creating new category: ${category.id}`);
        }
        await saveCategories(categories); // This will invalidate the cache
        console.log(`[db] Total categories in database: ${categories.length}`);
        return category;
    }
    catch (error) {
        console.error('[db] Error saving category:', error);
        throw error;
    }
}
async function deleteCategory(id) {
    const categories = await getCategories();
    const category = categories.find(c => c.id === id);
    if (category) {
        category.isActive = false;
        category.updatedAt = new Date().toISOString();
        await saveCategories(categories);
        return category;
    }
    return null;
}
// Colors
async function getColors() {
    const data = await readJsonFile(COLORS_DB, colorsCache);
    colorsCache = { data, timestamp: Date.now() };
    return data;
}
async function saveColors(colors) {
    await writeJsonFile(COLORS_DB, colors);
    colorsCache = null;
}
async function getColorById(id) {
    const colors = await getColors();
    return colors.find(c => c.id === id);
}
async function saveColor(color) {
    try {
        const colors = await getColors();
        const index = colors.findIndex(c => c.id === color.id);
        if (index >= 0) {
            colors[index] = color;
            console.log(`[db] Updating color: ${color.id}`);
        }
        else {
            colors.push(color);
            console.log(`[db] Creating new color: ${color.id}`);
        }
        await saveColors(colors);
        console.log(`[db] Total colors in database: ${colors.length}`);
        return color;
    }
    catch (error) {
        console.error('[db] Error saving color:', error);
        throw error;
    }
}
async function deleteColor(id) {
    const colors = await getColors();
    const color = colors.find(c => c.id === id);
    if (color) {
        color.isActive = false;
        color.updatedAt = new Date().toISOString();
        await saveColors(colors);
        return color;
    }
    return null;
}
// Users
async function getUsers() {
    const data = await readJsonFile(USERS_DB, usersCache);
    usersCache = { data, timestamp: Date.now() };
    return data;
}
async function saveUsers(users) {
    await writeJsonFile(USERS_DB, users);
    usersCache = null;
}
async function getUserById(id) {
    const users = await getUsers();
    return users.find(u => u.id === id);
}
async function saveUser(user) {
    const users = await getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
        users[index] = user;
    }
    else {
        users.push(user);
    }
    await saveUsers(users);
    return user;
}
// Cache invalidation helpers
function invalidateProductsCache() {
    productsCache = null;
}
function invalidateOrdersCache() {
    ordersCache = null;
}
function invalidateCategoriesCache() {
    categoriesCache = null;
}
function invalidateColorsCache() {
    colorsCache = null;
}
function invalidateUsersCache() {
    usersCache = null;
}

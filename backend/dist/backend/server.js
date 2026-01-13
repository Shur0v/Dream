"use strict";
/**
 * Express.js Backend Server
 * Main entry point for the backend API
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables from root .env
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), '.env') });
// Import routes
const products_1 = __importDefault(require("./express-routes/products"));
const categories_1 = __importDefault(require("./express-routes/categories"));
const colors_1 = __importDefault(require("./express-routes/colors"));
const orders_1 = __importDefault(require("./express-routes/orders"));
const auth_1 = __importDefault(require("./express-routes/auth"));
const cart_1 = __importDefault(require("./express-routes/cart"));
const admin_1 = __importDefault(require("./express-routes/admin"));
const users_1 = __importDefault(require("./express-routes/users"));
const featured_1 = __importDefault(require("./express-routes/featured"));
const banners_1 = __importDefault(require("./express-routes/banners"));
const best_selling_1 = __importDefault(require("./express-routes/best-selling"));
const upload_1 = __importDefault(require("./express-routes/upload"));
const reviews_1 = __importDefault(require("./express-routes/reviews"));
const app = (0, express_1.default)();
const PORT = process.env.BACKEND_PORT || 5000;
// Middleware - CORS with proper headers
// PERMISSIVE CORS: Allow all origins for maximum compatibility
// This removes all CORS restrictions to ensure API works from any domain
app.use((0, cors_1.default)({
    origin: true, // Allow all origins
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers',
    ],
    exposedHeaders: ['Content-Length', 'Content-Type'],
    maxAge: 86400, // 24 hours
    preflightContinue: false,
    optionsSuccessStatus: 204,
}));
// Log CORS configuration
console.log(`🌐 CORS enabled: ALL ORIGINS ALLOWED (permissive mode)`);
console.log(`   Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD`);
console.log(`   Credentials: enabled`);
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Static file serving for images
// Serve uploaded images from public/uploads directory
const publicUploadsPath = path_1.default.join(process.cwd(), 'public', 'uploads');
app.use('/uploads', express_1.default.static(publicUploadsPath));
console.log(`📁 Static files serving from: ${publicUploadsPath}`);
// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});
// API Routes
app.use('/api/products', products_1.default);
app.use('/api/categories', categories_1.default);
app.use('/api/colors', colors_1.default);
app.use('/api/orders', orders_1.default);
app.use('/api/auth', auth_1.default);
app.use('/api/cart', cart_1.default);
app.use('/api/admin', admin_1.default);
app.use('/api/users', users_1.default);
app.use('/api/featured-products', featured_1.default);
app.use('/api', banners_1.default);
app.use('/api', best_selling_1.default);
app.use('/api', upload_1.default);
app.use('/api', reviews_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Express server running on http://localhost:${PORT}`);
    console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
});
exports.default = app;

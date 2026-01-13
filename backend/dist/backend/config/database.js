"use strict";
/**
 * MongoDB Database Connection
 * Handles connection to MongoDB using Mongoose
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = connectToDatabase;
exports.ensureConnection = ensureConnection;
exports.disconnectFromDatabase = disconnectFromDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables from root .env
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), '.env') });
const MONGODB_URI = process.env.MONGODB_URI || '';
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'dream';
if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in environment variables');
    console.error('📁 Expected .env file at:', path_1.default.join(process.cwd(), '.env'));
    console.error('💡 Please create .env file in root directory with MONGODB_URI');
    throw new Error('MONGODB_URI is not defined in environment variables. Please create .env file in root directory.');
}
// Connection state
let isConnected = false;
let connectionPromise = null;
/**
 * Connect to MongoDB
 * @returns Promise<typeof mongoose>
 */
async function connectToDatabase() {
    // Return existing connection if already connected
    if (isConnected && mongoose_1.default.connection.readyState === 1) {
        return mongoose_1.default;
    }
    // Return existing promise if connection is in progress
    if (connectionPromise) {
        return connectionPromise;
    }
    // Create new connection promise
    // Fix write concern issue by explicitly setting it to override any URI parameters
    const connectionOptions = {
        dbName: MONGODB_DB_NAME,
        // Explicitly set write concern to override any malformed parameters in URI
        writeConcern: {
            w: 1, // Use numeric 1 (acknowledge write) instead of string to avoid parsing issues
        },
    };
    connectionPromise = mongoose_1.default.connect(MONGODB_URI, connectionOptions)
        .then((mongooseInstance) => {
        isConnected = true;
        console.log('✅ Connected to MongoDB');
        console.log(`📦 Database: ${MONGODB_DB_NAME}`);
        return mongooseInstance;
    })
        .catch((error) => {
        console.error('❌ MongoDB connection error:', error);
        connectionPromise = null;
        isConnected = false;
        throw error;
    });
    return connectionPromise;
}
/**
 * Ensure database connection is established
 * Use this in functions that need database access
 */
async function ensureConnection() {
    if (!isConnected || mongoose_1.default.connection.readyState !== 1) {
        await connectToDatabase();
    }
}
/**
 * Disconnect from MongoDB
 */
async function disconnectFromDatabase() {
    if (isConnected) {
        await mongoose_1.default.disconnect();
        isConnected = false;
        connectionPromise = null;
        console.log('🔌 Disconnected from MongoDB');
    }
}
// Handle connection events
mongoose_1.default.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
    isConnected = true;
});
mongoose_1.default.connection.on('error', (error) => {
    console.error('Mongoose connection error:', error);
    isConnected = false;
});
mongoose_1.default.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB');
    isConnected = false;
});
// Handle process termination
process.on('SIGINT', async () => {
    await disconnectFromDatabase();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    await disconnectFromDatabase();
    process.exit(0);
});
exports.default = mongoose_1.default;

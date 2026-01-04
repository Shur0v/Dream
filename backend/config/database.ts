/**
 * MongoDB Database Connection
 * Handles connection to MongoDB using Mongoose
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
const envPath = path.join(process.cwd(), 'backend', '.env');
const envResult = dotenv.config({ path: envPath });

// Also try loading from root .env if backend/.env doesn't exist
if (envResult.error) {
  dotenv.config({ path: path.join(process.cwd(), '.env') });
}

const MONGODB_URI = process.env.MONGODB_URI || '';
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'dream';

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in environment variables');
  console.error('📁 Expected .env file at:', envPath);
  console.error('💡 Please create backend/.env file with MONGODB_URI');
  throw new Error('MONGODB_URI is not defined in environment variables. Please create backend/.env file.');
}

// Connection state
let isConnected = false;
let connectionPromise: Promise<typeof mongoose> | null = null;

/**
 * Connect to MongoDB
 * @returns Promise<typeof mongoose>
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  // Return existing connection if already connected
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose;
  }

  // Return existing promise if connection is in progress
  if (connectionPromise) {
    return connectionPromise;
  }

  // Create new connection promise
  connectionPromise = mongoose.connect(MONGODB_URI, {
    dbName: MONGODB_DB_NAME,
  })
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
export async function ensureConnection(): Promise<void> {
  if (!isConnected || mongoose.connection.readyState !== 1) {
    await connectToDatabase();
  }
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectFromDatabase(): Promise<void> {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    connectionPromise = null;
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
  isConnected = true;
});

mongoose.connection.on('error', (error) => {
  console.error('Mongoose connection error:', error);
  isConnected = false;
});

mongoose.connection.on('disconnected', () => {
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

export default mongoose;


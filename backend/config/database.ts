/**
 * MongoDB Database Connection
 * Handles connection to MongoDB using Mongoose
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Lazy load environment variables - only when connection is needed (not during build)
function getMongoConfig() {
  // Check if we're in build mode (Next.js sets NODE_ENV during build)
  const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || 
                      process.env.NEXT_PHASE === 'phase-development' ||
                      !process.env.MONGODB_URI;
  
  // During build, return empty config to avoid errors
  if (isBuildTime && !process.env.MONGODB_URI) {
    return { 
      MONGODB_URI: 'mongodb://localhost:27017/dream', // Dummy URI for build
      MONGODB_DB_NAME: 'dream' 
    };
  }
  
  // Only load env when actually connecting (not during build)
  if (typeof process.env.MONGODB_URI === 'undefined' || process.env.MONGODB_URI === '') {
    dotenv.config({ path: path.join(process.cwd(), '.env') });
  }
  
  const MONGODB_URI = process.env.MONGODB_URI || '';
  const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'dream';
  
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in environment variables');
    console.error('📁 Expected .env file at:', path.join(process.cwd(), '.env'));
    console.error('💡 Please create .env file in root directory with MONGODB_URI');
    throw new Error('MONGODB_URI is not defined in environment variables. Please create .env file in root directory.');
  }
  
  return { MONGODB_URI, MONGODB_DB_NAME };
}

// Connection state
let isConnected = false;
let connectionPromise: Promise<typeof mongoose> | null = null;

/**
 * Connect to MongoDB
 * @returns Promise<typeof mongoose>
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  // Check if we're in build mode - skip connection during build
  const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';
  if (isBuildTime) {
    // Return a mock connection during build
    return mongoose;
  }

  // Return existing connection if already connected
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose;
  }

  // Return existing promise if connection is in progress
  if (connectionPromise) {
    return connectionPromise;
  }

  // Lazy load config only when connecting (not during build)
  const { MONGODB_URI, MONGODB_DB_NAME } = getMongoConfig();
  
  // Skip connection if using dummy URI (build time)
  if (MONGODB_URI === 'mongodb://localhost:27017/dream' && !process.env.MONGODB_URI) {
    return mongoose;
  }

  // Create new connection promise
  // Fix write concern issue by explicitly setting it to override any URI parameters
  const connectionOptions: mongoose.ConnectOptions = {
    dbName: MONGODB_DB_NAME,
    // Explicitly set write concern to override any malformed parameters in URI
    writeConcern: {
      w: 1, // Use numeric 1 (acknowledge write) instead of string to avoid parsing issues
      wtimeout: 5000,
    },
  };

  // Set connection timeout
  const connectionTimeout = 30000; // 30 seconds
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`MongoDB connection timeout after ${connectionTimeout}ms. Please check your MONGODB_URI.`));
    }, connectionTimeout);
  });

  // Create connection promise that waits for actual connection
  connectionPromise = new Promise<typeof mongoose>((resolve, reject) => {
    // Set up event listeners before connecting
    const onConnected = () => {
      isConnected = true;
      console.log('✅ Connected to MongoDB');
      console.log(`📦 Database: ${MONGODB_DB_NAME}`);
      cleanup();
      resolve(mongoose);
    };

    const onError = (error: Error) => {
      console.error('❌ MongoDB connection error:', error);
      console.error('💡 Please verify:');
      console.error('   1. MONGODB_URI is correct in .env file');
      console.error('   2. MongoDB server is running and accessible');
      console.error('   3. Network/firewall allows connection');
      isConnected = false;
      cleanup();
      reject(error);
    };

    const cleanup = () => {
      mongoose.connection.removeListener('connected', onConnected);
      mongoose.connection.removeListener('error', onError);
    };

    // Add event listeners
    mongoose.connection.once('connected', onConnected);
    mongoose.connection.once('error', onError);

    // Start connection
    mongoose.connect(MONGODB_URI, connectionOptions).catch((error) => {
      // Connection initiation failed
      onError(error);
    });

    // Set timeout
    setTimeout(() => {
      if (!isConnected && mongoose.connection.readyState !== 1) {
        cleanup();
        reject(new Error(`MongoDB connection timeout after ${connectionTimeout}ms. Please check your MONGODB_URI.`));
      }
    }, connectionTimeout);
  });

  return connectionPromise;
}

/**
 * Ensure database connection is established
 * Use this in functions that need database access
 */
export async function ensureConnection(): Promise<void> {
  // Skip connection during build
  const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';
  if (isBuildTime) {
    return;
  }
  
  // Check connection state
  const readyState = mongoose.connection.readyState;
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  
  if (readyState === 1 && isConnected) {
    // Already connected and verified
    return;
  }
  
  if (readyState === 2) {
    // Connection in progress, wait for it
    if (connectionPromise) {
      try {
        await connectionPromise;
        // Wait a bit more to ensure readyState is updated
        await new Promise(resolve => setTimeout(resolve, 100));
        if (mongoose.connection.readyState === 1) {
          return;
        }
      } catch (error) {
        // Connection failed, try to reconnect
        connectionPromise = null;
      }
    }
  }
  
  // Not connected, establish connection
  if (!isConnected || readyState === 0 || readyState === 3) {
    await connectToDatabase();
    // Wait for connection to be fully established
    let attempts = 0;
    while (mongoose.connection.readyState !== 1 && attempts < 30) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    
    if (mongoose.connection.readyState !== 1) {
      throw new Error('MongoDB connection not established after waiting');
    }
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


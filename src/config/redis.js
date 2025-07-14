import { createClient } from 'redis';

// Create Redis client with better error handling
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    connectTimeout: 5000,
    lazyConnect: true,
  },
});

// Error handling
redisClient.on('error', err => {
  console.error('❌ Redis error:', err);
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

redisClient.on('disconnect', () => {
  console.log('⚠️  Redis disconnected');
});

// Connect to Redis with fallback
let isRedisConnected = false;

const connectRedis = async () => {
  try {
    await redisClient.connect();
    isRedisConnected = true;
    console.log('✅ Redis connection established');
  } catch (error) {
    console.error('❌ Redis connection failed:', error.message);
    console.log('⚠️  Continuing without Redis cache...');
    isRedisConnected = false;
  }
};

// Initialize connection
connectRedis();

// Wrapper functions with fallback
const redisWrapper = {
  async get(key) {
    if (!isRedisConnected) return null;
    try {
      return await redisClient.get(key);
    } catch (error) {
      console.error('❌ Redis get error:', error.message);
      return null;
    }
  },

  async setEx(key, ttl, value) {
    if (!isRedisConnected) return;
    try {
      await redisClient.setEx(key, ttl, value);
    } catch (error) {
      console.error('❌ Redis setEx error:', error.message);
    }
  },

  async del(key) {
    if (!isRedisConnected) return;
    try {
      await redisClient.del(key);
    } catch (error) {
      console.error('❌ Redis del error:', error.message);
    }
  },

  async keys(pattern) {
    if (!isRedisConnected) return [];
    try {
      return await redisClient.keys(pattern);
    } catch (error) {
      console.error('❌ Redis keys error:', error.message);
      return [];
    }
  },

  async flushDb() {
    if (!isRedisConnected) return;
    try {
      await redisClient.flushDb();
    } catch (error) {
      console.error('❌ Redis flushDb error:', error.message);
    }
  },

  isConnected() {
    return isRedisConnected;
  },
};

export default redisWrapper;

const { Queue, Worker, QueueEvents } = require('bullmq');
const Redis = require('ioredis');

// Redis connection configuration for BullMQ
const redisConnection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  // Connection pool for high concurrency
  lazyConnect: true,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
};

// Create Redis connection
const redis = new Redis(redisConnection);

// Queue configuration for high concurrency (5M orders)
const QUEUE_CONFIG = {
  // Queue names
  QUEUES: {
    PAYMENT_PROCESSING: 'payment-processing',
    NOTIFICATIONS: 'notifications',
    ORDER_PROCESSING: 'order-processing',
  },
  
  // Job options
  JOB_OPTIONS: {
    // Retry configuration
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    
    // Remove completed jobs after 1 hour (to save memory)
    removeOnComplete: {
      age: 3600, // 1 hour
      count: 1000, // Keep last 1000 jobs
    },
    
    // Remove failed jobs after 24 hours
    removeOnFail: {
      age: 86400, // 24 hours
    },
    
    // Priority levels (1-20, higher = more priority)
    PRIORITY: {
      HIGH: 20,
      MEDIUM: 10,
      LOW: 1,
    },
  },
  
  // Worker configuration for high concurrency
  WORKER_CONFIG: {
    // Concurrency per worker (process multiple jobs in parallel)
    concurrency: 10,
    
    // Connection pool size
    connection: redisConnection,
    
    // Limiter for rate limiting (optional)
    limiter: {
      max: 100, // Max 100 jobs
      duration: 1000, // Per second
    },
  },
};

// Initialize queues
const paymentQueue = new Queue(QUEUE_CONFIG.QUEUES.PAYMENT_PROCESSING, {
  connection: redisConnection,
  defaultJobOptions: QUEUE_CONFIG.JOB_OPTIONS,
});

const notificationQueue = new Queue(QUEUE_CONFIG.QUEUES.NOTIFICATIONS, {
  connection: redisConnection,
  defaultJobOptions: QUEUE_CONFIG.JOB_OPTIONS,
});

const orderQueue = new Queue(QUEUE_CONFIG.QUEUES.ORDER_PROCESSING, {
  connection: redisConnection,
  defaultJobOptions: QUEUE_CONFIG.JOB_OPTIONS,
});

// Queue events for monitoring
const paymentQueueEvents = new QueueEvents(QUEUE_CONFIG.QUEUES.PAYMENT_PROCESSING, {
  connection: redisConnection,
});

const notificationQueueEvents = new QueueEvents(QUEUE_CONFIG.QUEUES.NOTIFICATIONS, {
  connection: redisConnection,
});

// Event listeners for monitoring
paymentQueueEvents.on('completed', ({ jobId }) => {
  console.log(`Payment job ${jobId} completed`);
});

paymentQueueEvents.on('failed', ({ jobId, failedReason }) => {
  console.error(`Payment job ${jobId} failed:`, failedReason);
});

notificationQueueEvents.on('completed', ({ jobId }) => {
  console.log(`Notification job ${jobId} completed`);
});

notificationQueueEvents.on('failed', ({ jobId, failedReason }) => {
  console.error(`Notification job ${jobId} failed:`, failedReason);
});

// Helper function to add job to queue
const addJob = async (queue, jobName, data, options = {}) => {
  try {
    const job = await queue.add(jobName, data, {
      priority: options.priority || QUEUE_CONFIG.JOB_OPTIONS.PRIORITY.MEDIUM,
      ...options,
    });
    return job;
  } catch (error) {
    console.error(`Error adding job to ${queue.name}:`, error);
    throw error;
  }
};

// Get queue stats
const getQueueStats = async (queue) => {
  try {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount(),
    ]);

    return {
      queue: queue.name,
      waiting,
      active,
      completed,
      failed,
      delayed,
      total: waiting + active + completed + failed + delayed,
    };
  } catch (error) {
    console.error(`Error getting stats for ${queue.name}:`, error);
    return null;
  }
};

// Health check
const healthCheck = async () => {
  try {
    await redis.ping();
    return {
      status: 'healthy',
      redis: 'connected',
      queues: {
        payment: await getQueueStats(paymentQueue),
        notification: await getQueueStats(notificationQueue),
        order: await getQueueStats(orderQueue),
      },
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};

// Close connections gracefully
const closeConnections = async () => {
  try {
    await paymentQueue.close();
    await notificationQueue.close();
    await orderQueue.close();
    await paymentQueueEvents.close();
    await notificationQueueEvents.close();
    await redis.quit();
    console.log('All queue connections closed');
  } catch (error) {
    console.error('Error closing queue connections:', error);
  }
};

module.exports = {
  // Queues
  paymentQueue,
  notificationQueue,
  orderQueue,
  
  // Queue events
  paymentQueueEvents,
  notificationQueueEvents,
  
  // Helper functions
  addJob,
  getQueueStats,
  healthCheck,
  closeConnections,
  
  // Configuration
  QUEUE_CONFIG,
  redisConnection,
  redis,
};

/**
 * Payment Processing Worker
 * Designed for high concurrency (5M orders in parallel)
 * Can be run in multiple instances for horizontal scaling
 * Run: node workers/payment.worker.js
 * Or: npm run worker:payment
 */

const { Worker } = require('bullmq');
const { QUEUE_CONFIG, redisConnection } = require('../config/queue');
const { payments, orders } = require('../models');

// Process payment job
const processPayment = async (job) => {
  const { paymentId, orderId, paymentData } = job.data;
  
  console.log(`[Payment Worker ${process.pid}] Processing payment ${paymentId} for order ${orderId}`);

  // Find payment record
  const payment = await payments.findByPk(paymentId);
  if (!payment) {
    throw new Error(`Payment ${paymentId} not found`);
  }

  // Update payment status to processing
  payment.status = 'processing';
  await payment.save();

  // Simulate payment processing (replace with actual payment gateway integration)
  // For high concurrency, use connection pooling and async operations
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay

  // Simulate payment success (in production, integrate with payment gateway)
  const paymentSuccess = Math.random() > 0.1; // 90% success rate for demo

  if (paymentSuccess) {
    // Update payment status
    payment.status = 'completed';
    payment.transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await payment.save();

    // Update order payment status
    const order = await orders.findByPk(orderId);
    if (order) {
      order.paymentStatus = 'completed';
      order.status = 'confirmed';
      await order.save();
    }

    // Queue notification job with high priority
    const { notificationQueue, addJob } = require('../config/queue');
    await addJob(
      notificationQueue,
      'order-confirmation',
      {
        orderId: orderId,
        userId: payment.userId,
      },
      {
        priority: QUEUE_CONFIG.JOB_OPTIONS.PRIORITY.HIGH,
      }
    );

    console.log(`[Payment Worker ${process.pid}] Payment ${paymentId} processed successfully`);
    return { success: true, transactionId: payment.transactionId };
  } else {
    payment.status = 'failed';
    await payment.save();

    const order = await orders.findByPk(orderId);
    if (order) {
      order.paymentStatus = 'failed';
      await order.save();
    }

    // Queue payment failed notification
    const { notificationQueue, addJob } = require('../config/queue');
    await addJob(
      notificationQueue,
      'payment-failed',
      {
        orderId: orderId,
        userId: payment.userId,
        reason: 'Payment gateway returned failure',
      },
      {
        priority: QUEUE_CONFIG.JOB_OPTIONS.PRIORITY.MEDIUM,
      }
    );

    throw new Error('Payment processing failed');
  }
};

// Create worker
const createPaymentWorker = () => {
  const worker = new Worker(
    QUEUE_CONFIG.QUEUES.PAYMENT_PROCESSING,
    processPayment,
    {
      connection: redisConnection,
      concurrency: QUEUE_CONFIG.WORKER_CONFIG.concurrency, // Process 10 jobs concurrently per worker
      limiter: QUEUE_CONFIG.WORKER_CONFIG.limiter,
    }
  );

  // Worker event handlers
  worker.on('completed', (job) => {
    console.log(`[Payment Worker ${process.pid}] Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[Payment Worker ${process.pid}] Job ${job?.id} failed:`, err.message);
  });

  worker.on('error', (err) => {
    console.error(`[Payment Worker ${process.pid}] Worker error:`, err);
  });

  return worker;
};

// Start worker
const startPaymentWorker = () => {
  console.log(`[Payment Worker ${process.pid}] Starting...`);
  const worker = createPaymentWorker();
  console.log(`[Payment Worker ${process.pid}] Started successfully`);
  console.log(`[Payment Worker ${process.pid}] Concurrency: ${QUEUE_CONFIG.WORKER_CONFIG.concurrency}`);
  return worker;
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log(`[Payment Worker ${process.pid}] SIGTERM received, shutting down gracefully...`);
  if (worker) {
    await worker.close();
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log(`[Payment Worker ${process.pid}] SIGINT received, shutting down gracefully...`);
  if (worker) {
    await worker.close();
  }
  process.exit(0);
});

// Start worker if run directly
let worker;
if (require.main === module) {
  worker = startPaymentWorker();
}

module.exports = { startPaymentWorker, createPaymentWorker };

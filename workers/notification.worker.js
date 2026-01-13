/**
 * Notification Worker
 * Designed for high concurrency
 * Can be run in multiple instances for horizontal scaling
 * Run: node workers/notification.worker.js
 * Or: npm run worker:notification
 */

const { Worker } = require('bullmq');
const { QUEUE_CONFIG, redisConnection } = require('../config/queue');
const { orders, User } = require('../models');

// Process notification job
const processNotification = async (job) => {
  const { type, orderId, userId, reason } = job.data;
  
  console.log(`[Notification Worker ${process.pid}] Processing ${type} notification for order ${orderId}`);

  try {
    // Fetch order and user details
    const order = await orders.findByPk(orderId, {
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ]
    });

    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    if (type === 'order-confirmation') {
      // Send order confirmation email
      if (order.User && order.User.email) {
        console.log(`[Notification Worker ${process.pid}] Sending email to ${order.User.email} for order ${order.orderNumber}`);
        // TODO: Integrate with email service (e.g., SendGrid, AWS SES, Nodemailer)
        // Use connection pooling for high concurrency
        // await emailService.send({
        //   to: order.User.email,
        //   subject: `Order Confirmation - ${order.orderNumber}`,
        //   template: 'order-confirmation',
        //   data: { order, user: order.User }
        // });
      }

      // Send SMS notification
      if (order.User && order.User.phone) {
        console.log(`[Notification Worker ${process.pid}] Sending SMS to ${order.User.phone} for order ${order.orderNumber}`);
        // TODO: Integrate with SMS service (e.g., Twilio, AWS SNS)
        // await smsService.send({
        //   to: order.User.phone,
        //   message: `Your order ${order.orderNumber} has been confirmed. Total: $${order.totalAmount}`
        // });
      }
    } else if (type === 'payment-failed') {
      // Send payment failed notification
      if (order.User && order.User.email) {
        console.log(`[Notification Worker ${process.pid}] Sending payment failed email to ${order.User.email}`);
        // TODO: Integrate with email service
      }
    }

    console.log(`[Notification Worker ${process.pid}] Notification sent for order ${orderId}`);
    return { success: true, orderId, userId };
  } catch (error) {
    console.error(`[Notification Worker ${process.pid}] Error processing notification:`, error);
    throw error;
  }
};

// Create worker
const createNotificationWorker = () => {
  const worker = new Worker(
    QUEUE_CONFIG.QUEUES.NOTIFICATIONS,
    processNotification,
    {
      connection: redisConnection,
      concurrency: QUEUE_CONFIG.WORKER_CONFIG.concurrency * 2, // Notifications can be processed faster (20 concurrent)
      limiter: {
        max: 200, // Max 200 notifications per second
        duration: 1000,
      },
    }
  );

  // Worker event handlers
  worker.on('completed', (job) => {
    console.log(`[Notification Worker ${process.pid}] Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[Notification Worker ${process.pid}] Job ${job?.id} failed:`, err.message);
  });

  worker.on('error', (err) => {
    console.error(`[Notification Worker ${process.pid}] Worker error:`, err);
  });

  return worker;
};

// Start worker
const startNotificationWorker = () => {
  console.log(`[Notification Worker ${process.pid}] Starting...`);
  const worker = createNotificationWorker();
  console.log(`[Notification Worker ${process.pid}] Started successfully`);
  console.log(`[Notification Worker ${process.pid}] Concurrency: ${QUEUE_CONFIG.WORKER_CONFIG.concurrency * 2}`);
  return worker;
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log(`[Notification Worker ${process.pid}] SIGTERM received, shutting down gracefully...`);
  if (worker) {
    await worker.close();
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log(`[Notification Worker ${process.pid}] SIGINT received, shutting down gracefully...`);
  if (worker) {
    await worker.close();
  }
  process.exit(0);
});

// Start worker if run directly
let worker;
if (require.main === module) {
  worker = startNotificationWorker();
}

module.exports = { startNotificationWorker, createNotificationWorker };

/**
 * Worker Manager
 * Can start all workers in a single process
 * For production with high concurrency (5M orders), run workers in separate processes/containers
 * Each worker can process multiple jobs concurrently
 */

const { startPaymentWorker } = require('./payment.worker');
const { startNotificationWorker } = require('./notification.worker');

// Start all workers
const startAllWorkers = () => {
  try {
    console.log('Starting all workers...');
    console.log(`Process ID: ${process.pid}`);
    
    // Start workers (they run in the same process but handle jobs concurrently)
    const paymentWorker = startPaymentWorker();
    const notificationWorker = startNotificationWorker();
    
    console.log('All workers started successfully');
    console.log('Workers are ready to process jobs from queues');
    
    return {
      paymentWorker,
      notificationWorker,
    };
  } catch (error) {
    console.error('Error starting workers:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
const shutdown = async () => {
  console.log('Shutting down workers...');
  const { closeConnections } = require('../config/queue');
  await closeConnections();
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Start workers if run directly
if (require.main === module) {
  startAllWorkers();
}

module.exports = {
  startAllWorkers,
  startPaymentWorker,
  startNotificationWorker,
};


const { getQueueStats, healthCheck, paymentQueue, notificationQueue, orderQueue } = require('../config/queue');

const monitorQueues = async () => {
  try {
    console.log('\n=== Queue Health Check ===');
    const health = await healthCheck();
    console.log(JSON.stringify(health, null, 2));

    console.log('\n=== Queue Statistics ===');
    
    const queues = [
      { name: 'Payment Processing', queue: paymentQueue },
      { name: 'Notifications', queue: notificationQueue },
      { name: 'Order Processing', queue: orderQueue },
    ];

    for (const { name, queue } of queues) {
      const stats = await getQueueStats(queue);
      if (stats) {
        console.log(`\n${name}:`);
        console.log(`  Waiting: ${stats.waiting}`);
        console.log(`  Active: ${stats.active}`);
        console.log(`  Completed: ${stats.completed}`);
        console.log(`  Failed: ${stats.failed}`);
        console.log(`  Delayed: ${stats.delayed}`);
        console.log(`  Total: ${stats.total}`);
      }
    }

    console.log('\n=== Monitoring Complete ===\n');
  } catch (error) {
    console.error('Error monitoring queues:', error);
  } finally {
    const { closeConnections } = require('../config/queue');
    await closeConnections();
    process.exit(0);
  }
};

if (require.main === module) {
  monitorQueues();
}

module.exports = { monitorQueues };


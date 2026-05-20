const cron = require('node-cron');
const Payment = require('../models/Payment');
const User = require('../models/User');

// Service to handle scheduled notification tasks
class NotificationSchedulerService {
  constructor(notificationService) {
    this.notificationService = notificationService;
    this.init();
  }

  init() {
    // Check for expired subscriptions every hour
    cron.schedule('0 * * * *', async () => {
      await this.checkExpiredSubscriptions();
    });

    // Check for expiring subscriptions (1 day before expiry) every day at 9 AM
    cron.schedule('0 9 * * *', async () => {
      await this.checkExpiringSubscriptions();
    });
  }

  async checkExpiredSubscriptions() {
    try {
      const now = new Date();
      const expiredSubscriptions = await Payment.find({
        'paymentStatus.status': 'verified',
        'paymentStatus.isActive': true,
        'paymentStatus.subscriptionEndDate': { $lt: now }
      });

      for (const subscription of expiredSubscriptions) {
        // Mark subscription as expired
        await Payment.findByIdAndUpdate(subscription._id, {
          'paymentStatus.status': 'expired',
          'paymentStatus.isActive': false
        });

        // Send expiration notification
        await this.notificationService.notifySubscriptionExpired(
          subscription._id,
          subscription.userDetails.userId
        );
      }
    } catch (error) {
      console.error('Error checking expired subscriptions:', error);
    }
  }

  async checkExpiringSubscriptions() {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(23, 59, 59, 999);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const expiringSubscriptions = await Payment.find({
        'paymentStatus.status': 'verified',
        'paymentStatus.isActive': true,
        'paymentStatus.subscriptionEndDate': {
          $gte: today,
          $lte: tomorrow
        }
      });

      for (const subscription of expiringSubscriptions) {
        // Create notification service instance to send warning
        await this.notificationService.createAndEmitNotification({
          recipientId: subscription.userDetails.userId,
          recipientType: 'user',
          senderId: 'system',
          senderType: 'system',
          type: 'subscription_expired', // You might want to add a 'subscription_expiring' type
          title: 'Subscription Expiring Soon ⚠️',
          message: `Your ${subscription.subscriptionPlan.planName} will expire tomorrow. Please renew to continue accessing premium features.`,
          relatedData: {
            subscriptionId: subscription._id,
            extra: {
              planName: subscription.subscriptionPlan.planName,
              expiringDate: subscription.paymentStatus.subscriptionEndDate
            }
          },
          priority: 'high'
        });
      }
    } catch (error) {
      console.error('Error checking expiring subscriptions:', error);
    }
  }

  // Manual trigger for testing
  async triggerExpiryCheck() {
    await this.checkExpiredSubscriptions();
    await this.checkExpiringSubscriptions();
  }
}

module.exports = NotificationSchedulerService;
